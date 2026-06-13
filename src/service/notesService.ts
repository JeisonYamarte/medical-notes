import { connectDB } from "@/lib/mongodb";
import Note, { type INote } from "@/model/note";

export interface NotesListResult {
    data: INote[];
    total: number;
}


export async function getNotes({
    userId,
    dateParam = null, 
    titleParam = null, 
    urgencyParam = null, 
    limit = 0, 
    skip = 0
}: {
    userId: string,
    dateParam?: string | null, 
    titleParam?: string | null, 
    urgencyParam?: string | null, 
    limit?: number , 
    skip?: number 
}) {
    let start: Date | undefined;
    let end: Date | undefined;
    if (dateParam) {
        const date = new Date(dateParam);
        start = new Date(date.setHours(0, 0, 0, 0));
        end = new Date(date.setHours(23, 59, 59, 999));
    }

    await connectDB();

    const filter = {
        userId,
        ...(dateParam ? { createdAt: { $gte: start, $lte: end } } : {}),
        ...(titleParam ? { title: { $regex: titleParam, $options: 'i' } } : {}),
        ...(urgencyParam ? { urgencyLevel: urgencyParam } : {}),
    };

    const [data, total] = await Promise.all([
        Note.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((skip - 1) * limit),
        Note.countDocuments(filter),
    ]);

    return { data, total };
}