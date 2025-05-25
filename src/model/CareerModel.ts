import mongoose, { Schema, Document, model, models } from 'mongoose';

// --- Interface ---
export interface ITreeNode {
  name: string;
  attributes?: {
    why?: string;
    description?: string;
  };
  children?: ITreeNode[];
}

export interface ICareerChart extends Document {
  name: string;
  children: ITreeNode[];
}

// --- Schema ---
const TreeNodeSchema: Schema = new Schema({
  name: { type: String, required: true },
  attributes: {
    why: String,
    description: String,
  },
  children: [this] 
}, { _id: false });

const CareerChartSchema: Schema = new Schema({
  name: { type: String, required: true },
  children: [TreeNodeSchema],
});

// --- Model ---
const CareerChartModel = models.CareerChart || model<ICareerChart>('CareerChart', CareerChartSchema);

export default CareerChartModel;
