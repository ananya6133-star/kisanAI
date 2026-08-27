import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { advisoryService } from '../services/advisoryService';
import { 
  Printer, 
  Trash2, 
  ArrowLeft, 
  Share2, 
  Check, 
  Layers, 
  Droplet, 
  MapPin, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { SummaryCard, CropAssessmentCard } from '../components/advisory-result/SummaryCard';
import { PriorityActions } from '../components/advisory-result/PriorityActions';
import { 
  SoilRecommendations, 
  IrrigationRecommendations, 
  NutrientRecommendations, 
  CropManagement 
} from '../components/advisory-result/SoilRecommendations';
import { PestDiseaseRisks, RiskAssessment } from '../components/advisory-result/PestDiseaseRisks';
import { InformationGaps, ProfessionalGuidance } from '../components/advisory-result/InformationGaps';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Spinner } from '../components/common/Spinner';
import { ErrorState } from '../components/common/ErrorState';

export function AdvisoryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessToken } = useAuth();

  const [advisory, setAdvisory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    async function loadAdvisory() {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getAccessToken();
        const response = await advisoryService.getAdvisoryById(id, token);
        if (response.success && response.data) {
          setAdvisory(response.data);
        } else {
          setError('The requested advisory could not be found or you do not have permission to view it.');
        }
      } catch (err) {
        console.error('Failed to load advisory:', err);
        setError(err.message || 'Failed to retrieve advisory details.');
      } finally {
        setIsLoading(false);
      }
    }

    loadAdvisory();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = await getAccessToken();
      await advisoryService.deleteAdvisory(id, token);

      setIsDeleteModalOpen(false);
      navigate('/history');
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Failed to delete advisory record.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <Spinner size="lg" label="Retrieving structured agricultural advisory..." />
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <ErrorState
          title="Advisory Not Found"
          message={error || 'This advisory does not exist or has been removed.'}
          onRetry={() => navigate('/history')}
        />
        <div className="mt-4 text-center">
          <Link to="/history" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
            ← Return to Advisory History
          </Link>
        </div>
      </div>
    );
  }

  const result = advisory.advisory_result || {};
  const formattedDate = new Date(advisory.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-8 pb-16 print-page max-w-5xl mx-auto">
      {/* Navigation & Action Toolbar */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            icon={isCopied ? Check : Share2}
          >
            {isCopied ? 'Link Copied' : 'Share'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            icon={Printer}
          >
            Print / Export PDF
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            icon={Trash2}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Farm & Metadata Overview Ribbon */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-slate-900 font-display text-base sm:text-lg">
            {advisory.crop_name}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
            {advisory.category}
          </span>
        </div>

        <div className="flex items-center gap-4 flex-wrap text-slate-500 font-medium">
          {advisory.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {advisory.location}
            </span>
          )}
          {advisory.farm_area && (
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              {advisory.farm_area} {advisory.area_unit || 'acres'}
            </span>
          )}
          {advisory.soil_type && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {advisory.soil_type} {advisory.soil_ph ? `(pH ${advisory.soil_ph})` : ''}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {formattedDate}
          </span>
        </div>
      </div>

      {/* 1. Summary Card */}
      <SummaryCard
        summary={result.summary}
        cropName={advisory.crop_name}
        date={advisory.created_at}
      />

      {/* 2. Crop Assessment Card */}
      <CropAssessmentCard assessment={result.crop_assessment} />

      {/* 3. Immediate Action Plan */}
      <PriorityActions actions={result.priority_actions} />

      {/* 4. Structured Recommendations (2-Column Responsive Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SoilRecommendations recommendations={result.soil_recommendations} />
        <IrrigationRecommendations recommendations={result.irrigation_recommendations} />
        <NutrientRecommendations recommendations={result.nutrient_recommendations} />
        <CropManagement recommendations={result.crop_management} />
      </div>

      {/* 5. Pest & Disease Risks */}
      <PestDiseaseRisks risks={result.pest_disease_risks} />

      {/* 6. Operational Risk Matrix */}
      <RiskAssessment risks={result.risk_assessment} />

      {/* 7. Information Gaps */}
      <InformationGaps gaps={result.information_gaps} />

      {/* 8. Responsible AI Agricultural Guidance */}
      <ProfessionalGuidance disclaimer={result.professional_guidance} />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Advisory Record"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete this advisory for <strong>{advisory.crop_name}</strong>? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              icon={Trash2}
            >
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
