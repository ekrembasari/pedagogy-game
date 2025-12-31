
import { IGameRepository, IAnalyticsRepository } from '@/domain/ports/repositories';
import { SolutionAttempt } from '@/domain/models/problem';
import { firestore } from '@/services/firebaseService'; // Assuming firestore instance is exported here
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

/**
 * Firebase adapter implementing both write and read-only ports.
 * NOTE: A single class implements both interfaces, but each interface must be
 * consumed by different layers to ensure compile-time safety.
 */
export class FirebaseRepository implements IGameRepository, IAnalyticsRepository {

  // --- IGameRepository Implementation (Write Operations) ---

  async saveAttempt(attempt: SolutionAttempt): Promise<void> {
    try {
      const attemptCollection = collection(firestore, 'studentAttempts');
      await addDoc(attemptCollection, attempt);
    } catch (error) {
      console.error("Error saving attempt to Firebase:", error);
      // In a real app, you'd have more robust error handling.
      throw new Error('Failed to save student attempt.');
    }
  }

  async updateLevelState(studentId: string, newLevel: number): Promise<void> {
    // This is a placeholder. A real implementation would involve updating a
    // 'studentProfiles' collection, for example.
    console.log(`Updating level for student ${studentId} to ${newLevel} in Firebase.`);
    // Example:
    // const studentDocRef = doc(firestore, 'students', studentId);
    // await updateDoc(studentDocRef, { currentLevel: newLevel });
    await Promise.resolve();
  }

  // --- IAnalyticsRepository Implementation (Read-Only Operations) ---

  async getAttemptsForAnalysis(studentId: string, level: number): Promise<SolutionAttempt[]> {
    // This is a simplified query. A real app might need more complex queries
    // to fetch attempts only for problems within a specific level.
    try {
      const attemptCollection = collection(firestore, 'studentAttempts');
      const q = query(
        attemptCollection,
        where("studentId", "==", studentId),
        // You would likely add a 'level' field to the SolutionAttempt model
        // to make this query efficient.
        // where("level", "==", level)
      );

      const querySnapshot = await getDocs(q);
      const attempts = querySnapshot.docs.map(doc => doc.data() as SolutionAttempt);
      return attempts;
    } catch (error) {
      console.error("Error fetching attempts from Firebase:", error);
      throw new Error('Failed to fetch student attempts for analysis.');
    }
  }
}
