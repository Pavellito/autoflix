export default function NetflixLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 111 30"
      className={className}
      aria-label="AutoFlix"
      role="img"
    >
      <g fill="#e50914">
        <path d="M0 0h5.3v23.7L11 0h5.3l-8 30H3L0 15.3V0zm17.3 0h5.1v30h-5.1V0zm8 0h13.4v4.5H30.4v7.8h7.3V17h-7.3v8.5h8.3V30H25.3V0zm15.8 0H47l5.3 18.3V0h4.9v30h-5.3L46.3 10v20h-5.2V0zm16 0h13.3v4.5H62.2v7.8h7.3V17h-7.3v8.5h8.3V30H57.1V0zm15.4 0h13.3v4.5H77.6v7.8h7.3V17h-7.3v8.5h8.3V30H72.5V0zm15.5 0h5.3v25.5h8V30H88V0zm15.7 0h5.1v30h-5.1V0zm8 0h5.3l4.5 12.3L111 0v30h-5.1V12L101.4 24h-.5l-4.5-12v18H91.3V0z" />
      </g>
    </svg>
  );
}
