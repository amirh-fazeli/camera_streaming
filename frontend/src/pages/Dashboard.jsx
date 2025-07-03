import './Dashboard.css';

function Dashboard({ cameraCount, onSubmit }) {
  const generateStreamUrl = (id) =>
    `http://your-server-ip:1984/api/stream.m3u8?src=cam${id}`;

  if (cameraCount === undefined) {
    return (
      <form className="login-form" onSubmit={onSubmit}>
        <label>
          Number of Cameras:
          <input type="number" name="camcount" min="1" />
        </label>
        <button type="submit">Load Grid</button>
      </form>
    );
  }

  return (
    <div className="video-grid">
      {[...Array(cameraCount)].map((_, index) => (
        <div key={index} className="video-tile">
          <video src={generateStreamUrl(index + 1)} autoPlay muted controls />
          <p>Camera {index + 1}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;