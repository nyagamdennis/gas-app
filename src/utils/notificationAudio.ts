// utils/notificationAudio.ts
export class NotificationAudioService {
  private static instance: NotificationAudioService
  private audioContext: AudioContext | null = null
  private stockDepletionSound: HTMLAudioElement | null = null
  private defaultSound: HTMLAudioElement | null = null
  private enabled = true

  private constructor() {
    this.initSounds()
  }

  static getInstance(): NotificationAudioService {
    if (!NotificationAudioService.instance) {
      NotificationAudioService.instance = new NotificationAudioService()
    }
    return NotificationAudioService.instance
  }

  private initSounds() {
    // Create audio elements with your sound files
    this.stockDepletionSound = new Audio(
      "/sounds/mixkit-magic-marimba-2820.wav",
    )
    this.defaultSound = new Audio(
      "/sounds/mixkit-magic-marimba-2820.wav",
    )

    // Preload sounds
    this.stockDepletionSound.load()
    this.defaultSound.load()
  }

  playStockDepletionSound() {
    if (!this.enabled) return

    try {
      if (this.stockDepletionSound) {
        this.stockDepletionSound.currentTime = 0
        this.stockDepletionSound.play().catch((e) => {
          console.warn("Audio playback failed:", e)
        })
      }
    } catch (error) {
      console.error("Error playing stock depletion sound:", error)
    }
  }

  playDefaultSound() {
    if (!this.enabled) return

    try {
      if (this.defaultSound) {
        this.defaultSound.currentTime = 0
        this.defaultSound.play().catch((e) => {
          console.warn("Audio playback failed:", e)
        })
      }
    } catch (error) {
      console.error("Error playing default sound:", error)
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (!enabled && this.stockDepletionSound) {
      this.stockDepletionSound.pause()
      this.stockDepletionSound.currentTime = 0
    }
    if (!enabled && this.defaultSound) {
      this.defaultSound.pause()
      this.defaultSound.currentTime = 0
    }
  }

  isEnabled(): boolean {
    return this.enabled
  }
}
