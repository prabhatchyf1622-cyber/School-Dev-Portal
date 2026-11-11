import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export interface IUserDocument extends Document {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  avatar: string;
  phone?: string;
  isActive?: boolean;
  isEmailVerified: boolean;
  isApproved: boolean;
  authProvider: 'local' | 'google';
  googleId?: string;
  verificationCode?: {
    code: string;
    expiresAt: Date;
  };
  resetPasswordToken?: {
    token: string;
    expiresAt: Date;
  };
  failedLoginAttempts: number;
  lockUntil?: Date;
  studentId?: string;
  classId?: string;
  section?: string;
  rollNumber?: string;
  parentContact?: string;
  parentId?: string;
  teacherId?: string;
  assignedClasses?: string[];
  assignedSubjects?: string[];
  designation?: string;
  childrenIds?: string[];
  linkedStudentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    password: { type: String },
    role: { type: String, enum: ['student', 'teacher', 'parent', 'admin'], default: 'student', required: true },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
    phone: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String, sparse: true },
    verificationCode: {
      code: { type: String },
      expiresAt: { type: Date },
    },
    resetPasswordToken: {
      token: { type: String },
      expiresAt: { type: Date },
    },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    studentId: { type: String },
    classId: { type: String },
    section: { type: String },
    rollNumber: { type: String },
    parentContact: { type: String },
    parentId: { type: String },
    teacherId: { type: String },
    assignedClasses: [{ type: String }],
    assignedSubjects: [{ type: String }],
    designation: { type: String },
    childrenIds: [{ type: String }],
    linkedStudentId: { type: String },
  },
  {
    timestamps: true,
  }
);

// Fallback in-memory / JSON file store when MONGODB_URI is not configured
export interface LocalUserRecord {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  avatar: string;
  phone?: string;
  isActive?: boolean;
  isEmailVerified: boolean;
  isApproved: boolean;
  authProvider: 'local' | 'google';
  googleId?: string;
  verificationCode?: {
    code: string;
    expiresAt: string;
  };
  resetPasswordToken?: {
    token: string;
    expiresAt: string;
  };
  failedLoginAttempts: number;
  lockUntil?: string;
  studentId?: string;
  classId?: string;
  section?: string;
  rollNumber?: string;
  parentContact?: string;
  parentId?: string;
  teacherId?: string;
  assignedClasses?: string[];
  assignedSubjects?: string[];
  designation?: string;
  childrenIds?: string[];
  linkedStudentId?: string;
  createdAt: string;
  updatedAt: string;
}

let UserModel: mongoose.Model<IUserDocument> | null = null;
let isMongoConnected = false;
const LOCAL_DB_PATH = path.resolve(process.cwd(), '.schooldev_users.json');

// Default initial password hash for demo accounts: "Password@123"
const DEFAULT_HASH = bcrypt.hashSync('Password@123', 10);

const SEED_USERS: LocalUserRecord[] = [
  {
    id: 'stu-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@student.schooldev.edu',
    username: 'aarav10a',
    password: DEFAULT_HASH,
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    isActive: true,
    isEmailVerified: true,
    isApproved: true,
    authProvider: 'local',
    studentId: 'SD-2026-1014',
    classId: '10',
    section: 'A',
    rollNumber: '14',
    parentContact: '+91 98765 11223',
    parentId: 'par-1',
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tea-1',
    name: 'Priya Verma',
    email: 'priya.verma@faculty.schooldev.edu',
    username: 'priya_math',
    password: DEFAULT_HASH,
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 22334',
    isActive: true,
    isEmailVerified: true,
    isApproved: true,
    authProvider: 'local',
    teacherId: 'TCH-2024-88',
    assignedClasses: ['10-A', '9-B', '11-A'],
    assignedSubjects: ['Mathematics', 'Physics'],
    designation: 'Senior Faculty & Academic Coordinator',
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'par-1',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@parent.schooldev.edu',
    username: 'rajesh_parent',
    password: DEFAULT_HASH,
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 11223',
    isActive: true,
    isEmailVerified: true,
    isApproved: true,
    authProvider: 'local',
    childrenIds: ['stu-1', 'stu-2'],
    linkedStudentId: 'SD-2026-1014',
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'adm-1',
    name: 'Dr. Sunita Kulkarni',
    email: 'principal@schooldev.edu',
    username: 'principal',
    password: DEFAULT_HASH,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+91 11 2948 2000',
    isActive: true,
    isEmailVerified: true,
    isApproved: true,
    authProvider: 'local',
    designation: 'Principal & Director of School Systems',
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let localUsers: LocalUserRecord[] = [];

// Initialize local database
function initLocalStore() {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      localUsers = JSON.parse(data);
      if (!Array.isArray(localUsers) || localUsers.length === 0) {
        localUsers = [...SEED_USERS];
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(localUsers, null, 2), 'utf-8');
      }
    } else {
      localUsers = [...SEED_USERS];
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(localUsers, null, 2), 'utf-8');
    }
  } catch {
    localUsers = [...SEED_USERS];
  }
}

// Eager initialization on load
initLocalStore();

function saveLocalStore() {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(localUsers, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Failed to persist local store:', err);
  }
}

// Connect to MongoDB if MONGODB_URI is provided
export async function connectDatabase(): Promise<{ isConnected: boolean; mode: 'mongodb' | 'local_fallback' }> {
  initLocalStore();
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('[DB] Connecting to MongoDB instance...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      isMongoConnected = true;
      UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
      console.log('[DB] Successfully connected to MongoDB.');

      // Check if seeded
      const count = await UserModel.countDocuments();
      if (count === 0) {
        console.log('[DB] Seeding initial institutional accounts to MongoDB...');
        for (const s of SEED_USERS) {
          await UserModel.create({
            ...s,
            _id: s.id.startsWith('stu') || s.id.startsWith('tea') || s.id.startsWith('par') || s.id.startsWith('adm') ? undefined : s.id,
          });
        }
      }
      return { isConnected: true, mode: 'mongodb' };
    } catch (err: any) {
      console.warn(`[DB] MongoDB connection failed (${err.message}). Using secure persistent local fallback.`);
      isMongoConnected = false;
      return { isConnected: false, mode: 'local_fallback' };
    }
  } else {
    console.log('[DB] No MONGODB_URI configured. Running with secure persistent local database store.');
    return { isConnected: false, mode: 'local_fallback' };
  }
}

export function isDbUsingMongo(): boolean {
  return isMongoConnected;
}

// User Repository API
export const UserRepository = {
  async findByEmail(email: string): Promise<LocalUserRecord | null> {
    const cleanEmail = email.toLowerCase().trim();
    if (isMongoConnected && UserModel) {
      const doc = await UserModel.findOne({ email: cleanEmail });
      return doc ? (doc.toObject() as any) : null;
    }
    const found = localUsers.find(u => u.email.toLowerCase() === cleanEmail);
    return found ? { ...found } : null;
  },

  async findByUsername(username: string): Promise<LocalUserRecord | null> {
    const cleanUsername = username.toLowerCase().trim();
    if (isMongoConnected && UserModel) {
      const doc = await UserModel.findOne({ username: cleanUsername });
      return doc ? (doc.toObject() as any) : null;
    }
    const found = localUsers.find(u => u.username?.toLowerCase() === cleanUsername);
    return found ? { ...found } : null;
  },

  async findByIdentifier(identifier: string): Promise<LocalUserRecord | null> {
    const clean = identifier.toLowerCase().trim();
    if (isMongoConnected && UserModel) {
      const doc = await UserModel.findOne({
        $or: [{ email: clean }, { username: clean }],
      });
      return doc ? (doc.toObject() as any) : null;
    }
    const found = localUsers.find(
      u => u.email.toLowerCase() === clean || (u.username && u.username.toLowerCase() === clean)
    );
    return found ? { ...found } : null;
  },

  async findById(id: string): Promise<LocalUserRecord | null> {
    if (isMongoConnected && UserModel) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const doc = await UserModel.findById(id);
        if (doc) return doc.toObject() as any;
      }
      const doc = await UserModel.findOne({ $or: [{ id }, { _id: id }] });
      return doc ? (doc.toObject() as any) : null;
    }
    const found = localUsers.find(u => u.id === id);
    return found ? { ...found } : null;
  },

  async findByGoogleId(googleId: string): Promise<LocalUserRecord | null> {
    if (isMongoConnected && UserModel) {
      const doc = await UserModel.findOne({ googleId });
      return doc ? (doc.toObject() as any) : null;
    }
    const found = localUsers.find(u => u.googleId === googleId);
    return found ? { ...found } : null;
  },

  async findByVerificationCode(email: string, code: string): Promise<LocalUserRecord | null> {
    const cleanEmail = email.toLowerCase().trim();
    const user = await this.findByEmail(cleanEmail);
    if (!user || !user.verificationCode) return null;

    if (user.verificationCode.code === code) {
      const expiresAt = new Date(user.verificationCode.expiresAt).getTime();
      if (Date.now() <= expiresAt) {
        return user;
      }
    }
    return null;
  },

  async findByResetToken(token: string): Promise<LocalUserRecord | null> {
    if (isMongoConnected && UserModel) {
      const doc = await UserModel.findOne({
        'resetPasswordToken.token': token,
        'resetPasswordToken.expiresAt': { $gt: new Date() },
      });
      return doc ? (doc.toObject() as any) : null;
    }
    const found = localUsers.find(
      u =>
        u.resetPasswordToken &&
        u.resetPasswordToken.token === token &&
        new Date(u.resetPasswordToken.expiresAt).getTime() > Date.now()
    );
    return found ? { ...found } : null;
  },

  async create(data: Partial<LocalUserRecord>): Promise<LocalUserRecord> {
    const now = new Date().toISOString();
    const id = data.id || `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newRecord: LocalUserRecord = {
      id,
      name: data.name || 'Anonymous User',
      email: (data.email || '').toLowerCase().trim(),
      username: data.username ? data.username.toLowerCase().trim() : undefined,
      password: data.password,
      role: data.role || 'student',
      avatar:
        data.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      phone: data.phone,
      isEmailVerified: data.isEmailVerified ?? false,
      isApproved: data.isApproved ?? false,
      authProvider: data.authProvider || 'local',
      googleId: data.googleId,
      verificationCode: data.verificationCode,
      resetPasswordToken: data.resetPasswordToken,
      failedLoginAttempts: 0,
      studentId: data.studentId,
      classId: data.classId,
      section: data.section,
      rollNumber: data.rollNumber,
      parentContact: data.parentContact,
      parentId: data.parentId,
      teacherId: data.teacherId,
      assignedClasses: data.assignedClasses,
      assignedSubjects: data.assignedSubjects,
      designation: data.designation,
      childrenIds: data.childrenIds,
      linkedStudentId: data.linkedStudentId,
      createdAt: now,
      updatedAt: now,
    };

    if (isMongoConnected && UserModel) {
      const created = await UserModel.create({
        ...newRecord,
      });
      return created.toObject() as any;
    }

    localUsers.push(newRecord);
    saveLocalStore();
    return { ...newRecord };
  },

  async update(id: string, updates: Partial<LocalUserRecord>): Promise<LocalUserRecord | null> {
    const now = new Date().toISOString();
    if (isMongoConnected && UserModel) {
      const doc = await UserModel.findOneAndUpdate(
        { $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : undefined }] },
        { ...updates, updatedAt: now },
        { new: true }
      );
      return doc ? (doc.toObject() as any) : null;
    }

    const index = localUsers.findIndex(u => u.id === id);
    if (index === -1) return null;

    localUsers[index] = {
      ...localUsers[index],
      ...updates,
      updatedAt: now,
    };
    saveLocalStore();
    return { ...localUsers[index] };
  },

  async getAll(): Promise<LocalUserRecord[]> {
    if (isMongoConnected && UserModel) {
      const docs = await UserModel.find().sort({ createdAt: -1 });
      return docs.map(d => d.toObject() as any);
    }
    return [...localUsers];
  },

  async getPending(): Promise<LocalUserRecord[]> {
    if (isMongoConnected && UserModel) {
      const docs = await UserModel.find({ isApproved: false }).sort({ createdAt: -1 });
      return docs.map(d => d.toObject() as any);
    }
    return localUsers.filter(u => !u.isApproved);
  },
};
