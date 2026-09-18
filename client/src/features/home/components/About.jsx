import aboutImg from "../../../assets/about-image.jpg";
function About() {
  return (
    <section id="about">
      <div className="about-text animation-slideUp">
        <p className="about-title">ABOUT US</p>
        <h2 className="about-subtitle">Passion in Every Cup</h2>
        <p className="about-description">
          At Brewly, we believe coffee is more than just a drink - it's an
          experience. Our beans are carefully selected from the best farms and
          brewed with passion to give you the perfect cup every time.
        </p>
        <div className="features1">
          <div className="feature-item1">
            <svg
              className="feature-icon1"
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5">
                <path d="M18.25 10.5h1.39c1.852 0 2.402.265 2.357 1.584c-.073 2.183-1.058 4.72-4.997 5.416" />
                <path d="M5.946 20.615C2.572 18.02 2.075 14.34 2.001 10.5c-.031-1.659.45-2 2.658-2h10.682c2.208 0 2.69.341 2.658 2c-.074 3.84-.57 7.52-3.945 10.115c-.96.738-1.77.885-3.135.885H9.081c-1.364 0-2.174-.147-3.135-.886Z" />
                <path
                  strokeLinejoin="round"
                  d="M11.309 2.5C10.762 2.839 10 4 10 5.5M7.54 4S7 4.5 7 5.5M14.001 4c-.273.17-.501 1-.501 1.5"
                />
              </g>
            </svg>

            <div className="feature-text1">
              <p className="feature-title1">5 +</p>
              <p className="feature-subtitle1">Years of Experience</p>
            </div>
          </div>

          <div className="feature-item1">
            <svg
              className="feature-icon1"
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M13 5.649c-2.842-2.842-6.792-3.5-8.822-1.47m0 0c-2.03 2.03-1.371 5.979 1.47 8.821m-1.47-8.822c.245 1.226 1.544 3.896 4.78 4.778m.253 10.833c2.086 2.086 6.146 1.41 9.067-1.511c2.92-2.921 3.597-6.98 1.51-9.067M9.212 19.79c-2.086-2.087-1.41-6.146 1.511-9.067c2.921-2.92 6.98-3.597 9.067-1.51M9.21 19.788c1.511-.504 4.372-.917 5.667-5.667c.907-3.324 3.652-4.659 4.91-4.91"
              />
            </svg>
            <div className="feature-text1">
              <p className="feature-title1">20 +</p>
              <p className="feature-subtitle1">Coffee Varieties</p>
            </div>
          </div>
          <div className="feature-item1 feature-last1">
            <svg
              className="feature-icon1"
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 21 21">
              <path d="M0 0h21v21H0z" fill="none" />
              <g fill="none" fillRule="evenodd" transform="translate(2 2)">
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="8"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="6" cy="6" r="1" fill="currentColor" />
                <circle cx="11" cy="6" r="1" fill="currentColor" />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.5 9.5q.904 2 3 2c2.096 0 2.397-.667 3-2"
                />
              </g>
            </svg>
            <div className="feature-text1">
              <p className="feature-title1">10k +</p>
              <p className="feature-subtitle1">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
      <div className="about-image">
        <img src={aboutImg} alt="about-picture" />
      </div>
    </section>
  );
}

export default About;
