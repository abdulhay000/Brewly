function Loading({ message = "Loading..." }) {
  return (
    <div className="user-no-results user-loading" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <h3>{message}</h3>
      <p>Fetching the latest Brewly products.</p>
    </div>
  );
}

export default Loading;
