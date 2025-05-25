import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ default: 'pending' }) // default status to 'pending'
  status: string;

  @Prop({ required: true })
  userId: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
