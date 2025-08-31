import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import "./team.css";
import "../../lib/fontawesome";

function MeetOurTeam() {
  return (
    <div>
      {/* Founders */}
      <div className="bgbox-wrapper">
        <div className="bgbox">
          <div className="meet-our-team">
            <h1 className="heading">Meet Our Team</h1>
          </div>
          <h3 className="team-member-role">Founders</h3>

          <div className="team-members2">
            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dcec61lxq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1724959866/WhatsApp_Image_2024-08-30_at_12.49.51_AM_cg7gmn.jpg"
                    }
                    alt="Vidushi Agarwal  avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/vidushi-agarwal-a95885256"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/agarwal.vidu?igsh=MWI4d3Jvb2locmVvcQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a
                      href="https://x.com/Vidushit143?t=4mzUEuIsF2nzUOrDhU_NGw&s=09"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Vidushi Agarwal </h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Founder</h6>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dcec61lxq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1724958308/IMG_20240430_003529_hk6mf6.jpg"
                    }
                    alt="Sonam avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/sonam-yadav-a647ab258?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/sonam_ydv0303?igsh=MTRiMW50NnBoZmthdg=="
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a
                      href="https://x.com/137_sonam3429?t=FKbrPncJzaVnEoLwZDYnzA&s=09"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Sonam</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Founder</h6>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dcec61lxq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1724992510/b4eacac2-e23f-41b1-8ce1-69334b7dd27f_gztkzv.jpg"
                    }
                    alt="Sripriya Agarwal  avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/sripriya-agarwal-483475261"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/sripriyaagarwal16?igsh=MXI3ejc3YXRzOXFhMA=="
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a
                      href="https://x.com/Agarwa1Sripriya"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Sripriya Agarwal </h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Founder</h6>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dcec61lxq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1724958407/SaiePic_SquareFit_wh1gyn.jpg"
                    }
                    alt="Saie avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/saie-pawar-96b27a262"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://instagram.com/_.saiee?igshid=MzMyNGUyNmU2YQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a
                      href="https://x.com/Saie__Pawar"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Saie Prakhar Pawar</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Founder</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="team-members">
            
            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dzwfmydmx/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1724998586/photo_6235583440917479616_x_vnz0tk.jpg"
                    }
                    alt="Avni Singh avatar"
                  />
                  <div className="social-media-icons">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Avni Singh </h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Founder</h6>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dcec61lxq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1724992377/58cc173a-2806-4dd4-9426-f37bafd91105_lekkdl.jpg"
                    }
                    alt="Chanda Jha avatar"
                  />
                  <div className="social-media-icons">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Chanda Jha</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Founder</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

{/* Leads */}
      <div className="bgbox-wrapper">
        <div className="bgbox">
          <div className="meet-our-team"></div>
          <h3 className="team-member-role">Leads</h3>
          {/* President */}
          <div className="team-members2">
            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dcec61lxq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1724959131/IMG_7050_duy2oc.png"
                    }
                    alt="Joysa Jain avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/joysa-jain-86b589283/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/joysajain.21?igsh=MXhnM3Y1ZWloMGRmYw%3D%3D&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Joysa Jain</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">President</h6>
                </div>
              </div>
            </div>

{/* Vice Presidents */}


            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dcec61lxq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1724959804/ef0car_tumptt.jpg"
                    }
                    alt="Kashish Rastogi  avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/kashish-rastogi-7a189b27a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/brighttt4?igsh=MXV2cjViNGJ1aXN6Mw=="
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a
                      href="https://x.com/KashishRastog19?t=hd_blcVaiJJtAWVsTtmrYw&s=09"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Kashish Rastogi </h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Vice President</h6>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dcec61lxq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1724958476/Myphoto_hiq3gg.jpg"
                    }
                    alt="Anushka Shanker avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/anushka-shanker-061b6a218/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/shankeranushka/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a
                      href="https://x.com/ShankerAnu23798"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Anushka Shanker</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Vice President</h6>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dcec61lxq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1724959125/Pari_wiuvo0.jpg"
                    }
                    alt="Pari avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/pari-gupta-168564289/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/parigupta9667/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Pari Gupta</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Treasurer</h6>
                </div>
              </div>
            </div>
          </div>

          {/* Mentorship Moderators */}

          <div className="team-members2">
            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dcec61lxq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1724959748/me_oqxnuy.jpg"
                    }
                    alt="Nandini Jain avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="www.linkedin.com/in/nandini-jain-00967028b"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/nandinijain004/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a
                      href="https://x.com/Nandini8409"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Nandini Jain</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Mentorship Moderator</h6>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dzwfmydmx/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1756640728/Srishti_Sudhakar_Mentorhsip_Moderator_kcgfry.jpg"
                    }
                    alt="Srishti Sudhakar avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/srishti-sudhakar-828250276?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/srishtisudhakar?igsh=MTk0b2puMGRhc3Fkcg=="
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a
                      href="https://x.com/SrishtiSud41882?t=q6pU5EOqP0wXBp-HJaQJPQ&s=09"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Srishti Sudhakar </h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Mentorship Moderator</h6>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      " https://res.cloudinary.com/dzwfmydmx/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1756640873/Areeba_Khanam_-_Team_manager_khs2hq.jpg"
                    }
                    alt="Areeba Khanam  avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/areeba-khan-70013128a"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/al_.hayy?igsh=dnI3aDNtNDNtZml6"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Areeba Khanam </h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Team Manager</h6>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dzwfmydmx/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1756640977/Shreya_nt0i1v.jpg"
                    }
                    alt="Shreya avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/shreya-kumari-2ba266269/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Shreya </h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Outreach Secretary</h6>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Event Management */}

      <div className="bgbox-wrapper">
        <div className="bgbox">
          <h3 className="team-member-role">Event Management</h3>

          <div className="team-members">
            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dcec61lxq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1724958832/IMG_20240823_183007_yl75hp.jpg"
                    }
                    alt="Preeti avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/preeti-127953294"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/p_r_e_e_t_i_5555?igsh=ZnhvcmxjYmlvanI0"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Preeti</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Head</h6>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      " https://res.cloudinary.com/dzwfmydmx/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1756650791/sonaliyadav_y80vsn.jpg"
                    }
                    alt="Khushi avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/sonali-yadav17/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a
                      href="https://x.com/Sonali_yadav17"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Sonali Yadav</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Head</h6>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Media */}

      <div className="bgbox-wrapper">
        <div className="bgbox">
          <h3 className="team-member-role">Media</h3>

          <div className="team-members">
            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dzwfmydmx/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1756651106/Vidhi_mediateam_nu7tcf.jpg"
                    }
                    alt="Vidhi Arora avatar"
                  />
                  <div className="social-media-icons">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Vidhi Arora</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Head</h6>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dzwfmydmx/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1756651106/Riya_Media_Team_xyhytg.jpg"
                    }
                    alt="Riya avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/riya-yadav-b64a45289/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/rao_._riya/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a
                      href="https://x.com/RiyaYadav199924_"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Riya </h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Head</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}

      <div className="bgbox-wrapper">
        <div className="bgbox">
          <h3 className="team-member-role">Content</h3>

          <div className="team-members">
            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dzwfmydmx/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1756653221/Ekamjot_Kaur_-_Content_Team_grk2sw.jpg"
                    }
                    alt="Ekamjot Kaur avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/ekamjot-kaur-oberoi?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/_kaur.ek_?igsh=MXJnYmkwcDYydm8wNA=="
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Ekamjot Kaur</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Head</h6>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dzwfmydmx/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1756653221/Suparna_Lahiri_aefh5a.jpg"
                    }
                    alt="Sohini Rathor  avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/suparna-l-904636244"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/itsokay_suparna"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a
                      href="https://twitter.com/itsokay_Suparna"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Suparna Lahiri </h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Head</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PR */}

      <div className="bgbox-wrapper">
        <div className="bgbox">
          <h3 className="team-member-role">PR</h3>



          <div className="team-members">

            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dcec61lxq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1724959554/niyatiTechneeds_q6xnde.jpg"
                    }
                    alt="Niyati Mishra avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/prachi-b-0a17a625a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Niyati Mishra</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Head Coordinator</h6>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dzwfmydmx/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1756664257/Istuti_PR_Team_g64mfr.jpg"
                    }
                    alt="Seeta avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/istuti-jain-744b18298"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/stuti_jn24"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a
                      href="https://x.com/stutijn24"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Istuti Jain</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Head</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsorship */}

      <div className="bgbox-wrapper">
        <div className="bgbox">
          <h3 className="team-member-role">Sponsorship</h3>


          <div className="team-members">
            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dcec61lxq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1724959317/DSC_0302_ozn1xo.jpg"
                    }
                    alt="Shilpi Kumari avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/shilpi-kumari-45696128a"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Shilpi Kumari</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Head</h6>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dcec61lxq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1724959316/1000046863_vhojlw.jpg"
                    }
                    alt="Prakshi avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="www.linkedin.com/in/prakshisagar"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Prakshi</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Head</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media */}

      <div className="bgbox-wrapper">
        <div className="bgbox">
          <h3 className="team-member-role">Social Media</h3>


          <div className="team-members1">
            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dzwfmydmx/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1756664258/Sakshi_sharma_media_team_xmltat.jpg"
                    }
                    alt="Sakshi Sharma avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/sakshi-sharma-188125277/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/sakshi.shhh/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a
                      href="https://x.com/SakshiS57199303"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Sakshi Sharma </h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Head</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical */}

      <div className="bgbox-wrapper">
        <div className="bgbox">
          <h3 className="team-member-role">Tech Team</h3>


          <div className="team-members1">
            <div className="card">
              <div className="team-member">
                <div className="image-container">
                  <img
                    className="rounded-avatar"
                    src={
                      "https://res.cloudinary.com/dzwfmydmx/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_blue,b_rgb:262c35/v1756664636/Anjali_Dass_tech_team_mczybb.jpg"
                    }
                    alt="Sakshi Sharma avatar"
                  />
                  <div className="social-media-icons">
                    <a
                      href="https://www.linkedin.com/in/anjali-dass-002b5a31a/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
                    </a>
                    <a
                      href="https://www.instagram.com/__anj__09/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                    </a>
                    <a
                      href="https://x.com/SakshiS57199303"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faXTwitter} aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <h2 className="team-member-name">Anjali</h2>
                <br />
                <div className="outer-position">
                  <h6 className="team-member-position">Head</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetOurTeam;
