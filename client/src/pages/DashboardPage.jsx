import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { advisoryService } from '../services/advisoryService';
import { 
  Sprout, 
  PlusCircle, 
  Layers, 
  Droplet, 
  Activity, 
  TrendingUp, 
  History, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentAdvisoryCard, QuickActionCard } from '../components/dashboard/RecentAdvisoryCard';
import { AdvisoryHistoryItem } from '../components/history/AdvisoryHistoryItem';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

export function DashboardPage() {
  const { user, getAccessToken } = useAuth();
  const [advisories, setAdvisories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const response = await advisoryService.getAdvisories({ limit: 6 }, token);

      setAdvisories(response.data || []);
      setTotalCount(response.pagination?.total || (response.data ? response.data.length : 0));
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(err.message || 'Failed to load your advisory dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute top crop
  const cropCounts = advisories.reduce((acc, curr) => {
    acc[curr.crop_name] = (acc[curr.crop_name] || 0) + 1;
    return acc;
  }, {});
  const topCrop = Object.keys(cropCounts).reduce((a, b) => (cropCounts[a] > cropCounts[b] ? a : b), null);

  const latestAdvisory = advisories[0] || null;

  return (
    <div className="space-y-8">
      {/* Welcome Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Welcome back, {user?.user_metadata?.full_name || 'Farmer'} 🌾
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time agricultural intelligence and crop management status for your farm.
          </p>
        </div>

        <Link to="/advisory/new">
          <Button variant="primary" icon={PlusCircle} size="md" className="shadow-sm">
            Create New Advisory
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" label="Loading farm advisory metrics..." />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <ErrorState
          title="Dashboard Error"
          message={error}
          onRetry={fetchDashboardData}
        />
      )}

      {/* Main Content */}
      {!isLoading && !error && (
        <>
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Total Advisories"
              value={totalCount}
              subtitle="Generated crop reports"
              icon={Sprout}
              color="emerald"
            />
            <StatCard
              title="Primary Crop"
              value={topCrop || 'None yet'}
              subtitle="Most analyzed crop"
              icon={Layers}
              color="amber"
            />
            <StatCard
              title="Latest Analysis"
              value={latestAdvisory ? latestAdvisory.crop_name : 'No active cycle'}
              subtitle={latestAdvisory ? new Date(latestAdvisory.created_at).toLocaleDateString() : 'Awaiting input'}
              icon={Activity}
              color="blue"
            />
            <StatCard
              title="AI Engine Status"
              value="Active"
              subtitle="Google Gemini 2.5 Flash"
              icon={ShieldCheck}
              color="purple"
            />
          </div>

          {/* Quick Action Banner */}
          <QuickActionCard
            title="Need recommendations for an upcoming crop cycle?"
            description="Submit your soil type, irrigation setup, and seasonal timing to receive actionable guidance in seconds."
            buttonLabel="Start Advisory"
            to="/advisory/new"
            icon={Sprout}
          />

          {/* Recent Advisory Highlight or Empty State */}
          {latestAdvisory ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Latest Crop Advisory
                </h3>
                <Link to={`/advisory/${latestAdvisory.id}`} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                  Inspect Report →
                </Link>
              </div>
              <RecentAdvisoryCard advisory={latestAdvisory} />
            </div>
          ) : (
            <EmptyState
              title="No crop advisories yet"
              description="Create your first farm advisory to unlock tailored soil, irrigation, fertilizer, and pest management plans."
              actionLabel="Create First Advisory"
              actionIcon={PlusCircle}
              onAction={() => window.location.href = '/advisory/new'}
            />
          )}

          {/* Advisory History Preview */}
          {advisories.length > 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Recent Farm Advisories
                </h3>
                <Link to="/history" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                  View All ({totalCount})
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {advisories.slice(1, 4).map((adv) => (
                  <AdvisoryHistoryItem
                    key={adv.id}
                    advisory={adv}
                    onDelete={() => {
                      // Navigate to history for managed delete
                      window.location.href = '/history';
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
