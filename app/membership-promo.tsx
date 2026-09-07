import Image from "next/image";
import { latestMemberVideo, youtubeMembershipUrl } from "./lib/channel-promotions";

export function MembershipPromo() {
  return (
    <aside className="membership-promo" aria-label="YouTube channel membership">
      <a className="membership-preview" href={`https://www.youtube.com/watch?v=${latestMemberVideo.id}`} target="_blank" rel="noreferrer" aria-label={`Watch ${latestMemberVideo.title} on YouTube`}>
        <Image src={`https://i.ytimg.com/vi/${latestMemberVideo.id}/hqdefault.jpg`} alt="" width={480} height={360} sizes="(max-width: 600px) 120px, 184px" />
        <span>Members only</span>
        <b aria-hidden="true">▶</b>
      </a>
      <div className="membership-promo-copy">
        <p className="membership-promo-label">YouTube memberships</p>
        <h2>Go deeper on Bittensor.</h2>
        <p>Get members-only TAO and subnet updates. Support the channel.</p>
        <small>Latest members video · {latestMemberVideo.publishedLabel}</small>
      </div>
      <div className="membership-promo-action">
        <a className="channel-promo-button membership-join" href={youtubeMembershipUrl} target="_blank" rel="noreferrer">Join on YouTube <span aria-hidden="true">↗</span></a>
        <small>Already a member? Tap the video.</small>
      </div>
    </aside>
  );
}
