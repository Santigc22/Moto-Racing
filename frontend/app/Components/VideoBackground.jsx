const VideoBackground = () => {
    return (
      <div className="video-background">
        <video autoPlay loop muted playsInline className="video">
        <source src="/videos/FuryRoad.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

<div className="overlay"></div>
  
        <style jsx>{`
          .video-background {
            position: static;
            width: 100%;
            overflow: hidden;
          }
          .video {
            position: fixed;
            top: 50%;
            left: 50%;
            min-width: 100%;
            min-height: 100%;
            width: auto;
            height: auto;
            z-index: -1;
            transform: translate(-50%, -50%);
            object-fit: cover;
          }

          .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5); /* Oscurece el video */
          z-index: -1;
        }
        `}</style>
      </div>
    );
  };
  
  export default VideoBackground;
  