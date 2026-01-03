export const resources = {
  en: {
    translation: {
      // App name
      appName: "Time Chef",
      
      // Main screen
      subtitle: "Cooking Timer",
      quickStart: "Quick Start",
      noActiveTimers: "No active timers",
      addTimer: "Add Timer",
      
      // Timer actions
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      delete: "Delete",
      confirm: "Confirm",
      cancel: "Cancel",
      backToList: "Back to List",
      
      // Sections
      inProgress: "In Progress",
      completed: "Cooking Completed",
      
      // Add timer screen
      createNewTimer: "Create New Timer",
      cookingName: "Cooking Name",
      cookingNamePlaceholder: "e.g., Boil Pasta",
      timerName: "Timer",
      minutes: "Minutes",
      seconds: "Seconds",
      selectIcon: "Select Icon",
      
      // Timer end
      timerComplete: "Timer Complete!",
      
      // Presets
      boilEgg: "Boil\nEgg",
      steamSweetPotato: "Steam\nSweet Potato",
      boilPasta: "Boil\nPasta",
      cookRamen: "Cook\nRamen",
    },
  },
  ko: {
    translation: {
      // App name
      appName: "타임쉐프",
      
      // Main screen
      subtitle: "요리 타이머",
      quickStart: "빠른 시작",
      noActiveTimers: "활성 타이머가 없습니다",
      addTimer: "+ 타이머 추가",
      
      // Timer actions
      start: "시작",
      pause: "일시정지",
      reset: "리셋",
      delete: "삭제",
      confirm: "확인",
      cancel: "취소",
      backToList: "← 목록으로",
      
      // Sections
      inProgress: "진행중",
      completed: "요리 완료",
      
      // Add timer screen
      createNewTimer: "새 타이머 만들기",
      cookingName: "요리 이름",
      cookingNamePlaceholder: "예: 파스타 삶기",
      timerName: "타이머",
      minutes: "분",
      seconds: "초",
      selectIcon: "아이콘 선택",
      
      // Timer end
      timerComplete: "타이머 종료!",
      
      // Presets
      boilEgg: "달걀\n삶기",
      steamSweetPotato: "고구마\n찌기",
      boilPasta: "파스타\n삶기",
      cookRamen: "라면\n끓이기",
    },
  },
} as const;

export type SupportedLang = keyof typeof resources; // 'en' | 'ko'
export const supportedLangs: SupportedLang[] = ["en", "ko"];
export const fallbackLang: SupportedLang = "ko"; // 기본값을 한국어로 변경
