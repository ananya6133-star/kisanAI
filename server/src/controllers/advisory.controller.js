import { advisoryRequestSchema } from '../schemas/advisoryRequest.schema.js';
import { generateCropAdvisory } from '../services/geminiService.js';
import * as advisoryService from '../services/advisoryService.js';

/**
 * Controller: Generate and save a new crop advisory
 * POST /api/advisories
 */
export async function createAdvisory(req, res, next) {
  try {
    const userId = req.user.id;

    // 1. Zod Request Validation
    const validatedData = advisoryRequestSchema.parse(req.body);

    // 2. Gemini AI Advisory Generation & Validation
    const aiAdvisoryResult = await generateCropAdvisory(validatedData);

    // 3. Database Persistence
    const savedRecord = await advisoryService.createAdvisoryRecord(
      userId,
      validatedData,
      aiAdvisoryResult
    );

    return res.status(201).json({
      success: true,
      message: 'Agricultural advisory generated successfully',
      data: savedRecord
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller: List authenticated user's advisory history
 * GET /api/advisories
 */
export async function listAdvisories(req, res, next) {
  try {
    const userId = req.user.id;
    const { search, crop, page, limit, sort } = req.query;

    const result = await advisoryService.getUserAdvisories(userId, {
      search,
      crop,
      page,
      limit,
      sort
    });

    return res.status(200).json({
      success: true,
      data: result.advisories,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller: Get specific advisory by ID (Strict ownership isolation)
 * GET /api/advisories/:id
 */
export async function getAdvisory(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const advisory = await advisoryService.getAdvisoryById(id, userId);

    if (!advisory) {
      return res.status(404).json({
        success: false,
        error: 'Advisory record not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: advisory
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller: Delete user's advisory by ID
 * DELETE /api/advisories/:id
 */
export async function deleteAdvisory(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await advisoryService.deleteAdvisoryById(id, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Advisory record not found or already deleted'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Advisory record deleted successfully'
    });
  } catch (err) {
    next(err);
  }
}
