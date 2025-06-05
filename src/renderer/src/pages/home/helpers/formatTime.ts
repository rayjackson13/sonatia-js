import { differenceInDays } from 'date-fns/differenceInDays'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { format } from 'date-fns/format'

export const formatTime = (timestamp: number): string => {
  return differenceInDays(new Date(), timestamp) < 7
    ? formatDistanceToNow(timestamp, { addSuffix: true })
    : format(timestamp, 'dd MMM yyyy HH:mm')
}
