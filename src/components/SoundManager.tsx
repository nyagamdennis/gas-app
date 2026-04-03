// components/SoundManager.tsx
import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "../app/hooks"
import { setAudioEnabled } from "../features/notification/notificationSlice"
import { NotificationAudioService } from "../utils/notificationAudio"

export const SoundManager = () => {
  const dispatch = useAppDispatch()
  const { audioEnabled, items } = useAppSelector((state) => state.notifications)
  const audioService = NotificationAudioService.getInstance()

  useEffect(() => {
    // Sync audio service with Redux state
    audioService.setEnabled(audioEnabled)
  }, [audioEnabled])

  useEffect(() => {
    // Listen for new notifications that are stock depletion
    const lastNotification = items[0]
    if (lastNotification && audioEnabled) {
      const isStockDepletion =
        lastNotification.category === "stock-depletion" ||
        lastNotification.title?.toLowerCase().includes("stock")

      if (isStockDepletion) {
        audioService.playStockDepletionSound()
      } else {
        audioService.playDefaultSound()
      }
    }
  }, [items, audioEnabled])

  return null // This is a utility component, no UI
}
