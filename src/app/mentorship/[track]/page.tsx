import { MENTORSHIP_TRACKS } from '@/data/content';
import TrackDetailClient from '@/components/TrackDetailClient';

export function generateStaticParams() {
  return MENTORSHIP_TRACKS.map((track) => ({
    track: track.slug,
  }));
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const resolvedParams = await params;
  return <TrackDetailClient trackSlug={resolvedParams.track} />;
}
