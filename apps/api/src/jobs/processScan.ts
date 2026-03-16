import { Worker, Queue } from 'bullmq';
import { prisma } from '../lib/prisma';
import { redisConnection } from '../lib/redis';
import { analyzePhoto } from '../services/ai';

export const scanQueue = new Queue('scan-processing', {
  connection: redisConnection,
});

export function startScanWorker() {
  const worker = new Worker(
    'scan-processing',
    async (job) => {
      const { scanId, imagePath, location } = job.data;

      try {
        const items = await analyzePhoto(imagePath, location);

        // Create scan items and update scan status
        await prisma.$transaction(async (tx) => {
          for (const item of items) {
            await tx.scanItem.create({
              data: {
                scanId,
                itemName: item.itemName,
                brand: item.brand,
                category: item.category,
                quantity: item.quantity,
                unit: item.unit,
                confidenceScore: item.confidenceScore,
                expiresInDays: item.expiresInDays,
              },
            });
          }

          await tx.scan.update({
            where: { id: scanId },
            data: { status: 'COMPLETED', itemCount: items.length },
          });
        });
      } catch (error) {
        console.error('Scan processing failed:', error);
        await prisma.scan.update({
          where: { id: scanId },
          data: { status: 'FAILED' },
        });
        throw error;
      }
    },
    { connection: redisConnection, concurrency: 2 }
  );

  worker.on('failed', (job, err) => {
    console.error(`Scan job ${job?.id} failed:`, err.message);
  });

  return worker;
}
