// React import not required due to automatic JSX runtime

const companies = [
  { name: "Firebase", img: "/assets/img/logo/firebase.png" },
  { name: "Meet", img: "/assets/img/logo/meet.png" },
  { name: "Microsoft", img: "/assets/img/logo/microsoft.png" },
  { name: "React", img: "/assets/img/logo/react.png" },
  { name: "Tailwind", img: "/assets/img/logo/tailwindcss.png" },
  { name: "Zoom", img: "/assets/img/logo/zoom.png" },
];

export default function LogoCarousel() {
  return (
    <section className="w-full py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative flex overflow-hidden">
          {/* Continuous scroll container */}
          <div className="flex animate-marquee space-x-32">
            {[...companies, ...companies].map((c, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center justify-center"
              >
                <img
                  src={c.img}
                  alt={c.name}
                  className="h-20 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
