
// This file centralizes all user-facing strings for the game UI.
// The rest of the application (domain, application, infrastructure) MUST NOT contain Turkish strings.

export const gameText = {
  // Toast Messages
  correctAnswer: {
    title: "Doğru!",
    description: (stars: number) => `Harika! ${stars} yıldız kazandın.`,
  },
  incorrectAnswer: {
    title: "Tam Değil...",
    description: "Haydi tekrar deneyelim. Hesaplamalarını kontrol et.",
  },
  levelUp: {
    title: "Seviye Atladın!",
    description: (levelTitle: string) => `'${levelTitle}' seviyesine ulaştın.`,
  },
  blockComplete: {
    title: "Blok Tamamlandı!",
    description: (blockTitle: string) => `'${blockTitle}' bloğuna geçtin. Başarılar!`,
  },
  gameComplete: {
    title: "Tebrikler!",
    description: "Tüm problemleri tamamladın!",
  },
  checkpointTime: {
    title: "Checkpoint Zamanı!",
    description: "Şimdi öğrendiklerini gösterme zamanı.",
  },
  progressReset: {
    title: "Progress Reset",
    description: "Your game has been reset to the beginning.",
  },
  noMoreHints: {
    title: "Bu problem için başka ipucu yok.",
  },
  hintTitle: (hintNumber: number) => `İpucu #${hintNumber}`,

  // Button Labels
  submitButton: "Gönder",
  nextProblemButton: "Sıradaki Problem",
  hintButton: "İpucu İste",

  // Game component
  loading: "Yükleniyor...",
  reports: "Raporlar",
  settings: "Ayarlar",
  enterFullScreen: "Tam Ekrana Geç",
  exitFullScreen: "Tam Ekrandan Çık",
  level: "Seviye",

  // InfoPanel component
  instructorNote: "Eğitmen Notu",
  commonErrors: "Normal Karşılanan Hatalar",
  guidingQuestions: "Yönlendirme Soruları",
  cognitiveStruggleTitle: "Dikkat Edilmesi Gerekenler",

  // LevelSidebar component
  levelMap: "Seviye Haritası",
  currentLevel: "Şu anki Seviye",

  // AnswerForm component
  enterNumberError: "Sayı girin",
};
