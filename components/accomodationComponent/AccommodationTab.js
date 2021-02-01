import React, { Component } from "react";
import Footer from "../../commons/footer/Footer";
import LoadingOverlay from "react-loading-overlay";
import Loader from "react-loader-spinner";

class AccommodationTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false
    };
  }

  render() {
    return (
      <div className="tms-content">
        <LoadingOverlay
          active={this.state.isActive}
          spinner={<Loader type="Watch" height={100} width={100} />}
        >
          <article>
            <main role="main" class="inner cover">
              <h1 class="cover-heading">Welcome to Accommodation!</h1>
            </main>
          </article>
          <Footer />
        </LoadingOverlay>
      </div>
    );
  }
}

export default AccommodationTab;
