import ChatBox from '../../../components/ChatBox';

export default async function SportPage({ params }: { params: { slug: string } }) {
  const sportParams = await params; //FIXME: params is not a promise, but issue when building
  const sport = decodeURIComponent(sportParams.slug.toLowerCase());
  return <ChatBox sport={sport} />;
}
