import ChatBox from '../../../components/ChatBox';

export default async function SportPage({ params }: { params: { slug: string } }) {
  const sportParams = await params;
  const sport = decodeURIComponent(sportParams.slug.toLowerCase());
  return <ChatBox sport={sport} />;
}
