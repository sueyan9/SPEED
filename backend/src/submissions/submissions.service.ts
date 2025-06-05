import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission } from './submission.schema';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
  ) {}

  async create(data: Partial<Submission>): Promise<Submission> {
    console.log('Received data in service:', data);
    const created = new this.submissionModel(data);
    return created.save();
  }

  async findAll(): Promise<Submission[]> {
    return this.submissionModel.find().exec();
  }

  async findByStatus(status: string): Promise<Submission[]> {
    return this.submissionModel.find({ status }).exec();
  }

  async updateStatus(id: string, status: string): Promise<Submission> {
    const updated = await this.submissionModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!updated) {
      throw new Error(`Submission with id ${id} not found`);
    }
    return updated;
  }

  async search(query: string): Promise<Submission[]> {
  const regex = new RegExp(query, 'i');

  return this.submissionModel.find({
    $or: [
      { title: regex },
      { authors: regex },
      { journal: regex },
      { claim: regex },
      { evidence: regex },
      { doi: regex }
    ]
  }).exec();
}

}
