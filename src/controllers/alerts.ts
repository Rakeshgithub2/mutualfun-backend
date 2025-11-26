import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import { AuthRequest } from '../middlewares/auth';
import { formatResponse } from '../utils/response';

const createAlertSchema = z.object({
  fundId: z.string().cuid().optional(),
  type: z.enum(['NAV_THRESHOLD', 'PRICE_CHANGE', 'NEWS']),
  condition: z.string(), // JSON string with alert conditions
});

export const createAlert = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const validatedData = createAlertSchema.parse(req.body);

    // Validate fundId if provided
    if (validatedData.fundId) {
      const fund = await prisma.fund.findUnique({
        where: { id: validatedData.fundId },
      });

      if (!fund) {
        res.status(404).json({ error: 'Fund not found' });
        return;
      }
    }

    const alert = await prisma.alert.create({
      data: {
        fundId: validatedData.fundId || null,
        type: validatedData.type,
        condition: validatedData.condition,
        userId: req.user!.id,
      },
      include: {
        fund: {
          select: {
            id: true,
            name: true,
            amfiCode: true,
          },
        },
      },
    });

    res
      .status(201)
      .json(formatResponse(alert, 'Alert created successfully', 201));
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }

    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const alerts = await prisma.alert.findMany({
      where: { userId: req.user!.id },
      include: {
        fund: {
          select: {
            id: true,
            name: true,
            amfiCode: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(formatResponse(alerts, 'Alerts retrieved successfully'));
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
