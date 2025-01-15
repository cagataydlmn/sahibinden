export default function AdvertDescription({ description }) {
  return (
    <div className="advert__Description__title">
      <div className="advert__Description__titles">İlan Açıklaması:</div>
      <div className="advert__description">{description}</div>
    </div>
  );
}