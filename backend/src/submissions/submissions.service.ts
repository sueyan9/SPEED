import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission, SubmissionDocument } from './submission.schema';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
  ) {}

  async create(data: Partial<Submission>): Promise<Submission> {
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

  async search(query: string, status = 'analyst-approved'): Promise<Submission[]> {
    const regex = new RegExp(query, 'i');

    return this.submissionModel
      .find({
        $and: [
          {
            $or: [
              { title: regex },
              { authors: regex },
              { journal: regex },
              { claim: regex },
              { evidence: regex },
              { doi: regex },
            ],
          },
          { status },
        ],
      })
      .exec();
  }
}
