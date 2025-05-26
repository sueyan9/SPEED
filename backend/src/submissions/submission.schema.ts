import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubmissionDocument = Submission & Document;
@Schema()
export class Submission extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  authors: string;

  @Prop()
  journal: string;

  @Prop()
  year: number;

  @Prop()
  volume?: string;

  @Prop()
  number?: string;

  @Prop()
  pages?: string;

  @Prop()
  doi: string;

  @Prop()
  claim: string;

  @Prop()
  evidence: string;

  @Prop({
    default: 'pending',
    enum: [
      'pending',
      'rejected',
      'moderator-approved',
      'moderator-rejected',
      'analyst-approved',
      'analyst-rejected',
      'completed',
    ],
  }) // default status to 'pending'
  status: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
