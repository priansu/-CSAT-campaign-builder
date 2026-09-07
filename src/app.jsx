import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  FileText,
  Image as ImageIcon,
  Info,
  MessageCircle,
  Palette,
  Plus,
  RotateCcw,
  Send,
  Settings2,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import "./styles.css";

const DEFAULT_CAMPAIGN = {
  name: "CSAT Campaign",
  initialTitle: "How would you rate your experience?",
  initialSubtitle:
    "We'd love to hear what you think about your experience.",
  options: ["Loved it", "It was good", "Could be better"],
  commentEnabled: true,
  commentPlaceholder: "Tell us a little more (optional)",
  submitText: "Send feedback",
  thankYouMedia: null,
  thankYouTitle: "Thanks for your feedback!",
  thankYouSubtitle:
    "Your feedback helps us improve the experience for everyone.",
  thankYouButtonText: "Done",
};

const DEFAULT_STYLING = {
  backgroundColor: "#ffffff",
  titleColor: "#252a35",
  subtitleColor: "#7b8392",
  buttonColor: "#635bff",
  buttonTextColor: "#ffffff",
  selectedRatingColor: "#635bff",
  unselectedRatingColor: "#d9dce5",
  titleFontSize: 24,
  titleFontWeight: "700",
  subtitleFontSize: 14,
  subtitleFontWeight: "400",
  buttonFontSize: 13,
  buttonFontWeight: "700",
  borderRadius: 18,
  buttonWidth: "100%",
  buttonHeight: 48,
};

function cloneDefaults() {
  return {
    campaign: {
      ...DEFAULT_CAMPAIGN,
      options: [...DEFAULT_CAMPAIGN.options],
    },
    styling: {
      ...DEFAULT_STYLING,
    },
  };
}

function App() {
  const [campaign, setCampaign] = useState(() => {
    const defaults = cloneDefaults();
    return defaults.campaign;
  });

  const [styling, setStyling] = useState(() => {
    const defaults = cloneDefaults();
    return defaults.styling;
  });

  // Always start the application in light mode.
  // We intentionally do not read localStorage here.
  const [theme, setTheme] = useState("light");

  const [activeTab, setActiveTab] = useState("content");

  const [previewPage, setPreviewPage] = useState("feedback");
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [comment, setComment] = useState("");

  const [mediaPreviewUrl, setMediaPreviewUrl] = useState("");
  const [mediaType, setMediaType] = useState("");
  const mediaInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mediaPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(mediaPreviewUrl);
      }
    };
  }, [mediaPreviewUrl]);

  const progress = useMemo(() => {
    let total = 7;
    let complete = 0;

    if (campaign.initialTitle.trim()) complete++;
    if (campaign.initialSubtitle.trim()) complete++;
    if (campaign.options.length > 0) complete++;
    if (campaign.submitText.trim()) complete++;
    if (campaign.thankYouTitle.trim()) complete++;
    if (campaign.thankYouSubtitle.trim()) complete++;
    if (campaign.thankYouButtonText.trim()) complete++;

    return Math.round((complete / total) * 100);
  }, [campaign]);

  const updateCampaign = (key, value) => {
    setCampaign((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateStyling = (key, value) => {
    setStyling((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateOption = (index, value) => {
    setCampaign((previous) => {
      const options = [...previous.options];
      options[index] = value;

      return {
        ...previous,
        options,
      };
    });
  };

  const addOption = () => {
    setCampaign((previous) => ({
      ...previous,
      options: [...previous.options, "New feedback option"],
    }));
  };

  const deleteOption = (index) => {
    setCampaign((previous) => ({
      ...previous,
      options: previous.options.filter((_, optionIndex) => optionIndex !== index),
    }));
  };

  const handleMediaUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "application/json",
    ];

    const extension = file.name.split(".").pop()?.toLowerCase();

    const isLottie =
      extension === "json" ||
      extension === "lottie" ||
      file.type === "application/json";

    const isImage =
      file.type.startsWith("image/") ||
      ["png", "jpg", "jpeg", "gif"].includes(extension);

    if (!isImage && !isLottie && !allowedTypes.includes(file.type)) {
      return;
    }

    if (mediaPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(mediaPreviewUrl);
    }

    const url = URL.createObjectURL(file);

    setMediaPreviewUrl(url);
    setMediaType(isLottie ? "lottie" : "image");

    updateCampaign("thankYouMedia", file);
  };

  const removeMedia = () => {
    if (mediaPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(mediaPreviewUrl);
    }

    setMediaPreviewUrl("");
    setMediaType("");

    updateCampaign("thankYouMedia", null);

    if (mediaInputRef.current) {
      mediaInputRef.current.value = "";
    }
  };

  const resetPreview = () => {
    setPreviewPage("feedback");
    setSelectedRating(0);
    setSelectedOption("");
    setComment("");
  };

  const resetCampaign = () => {
    const defaults = cloneDefaults();

    if (mediaPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(mediaPreviewUrl);
    }

    setCampaign(defaults.campaign);
    setStyling(defaults.styling);
    setActiveTab("content");
    setMediaPreviewUrl("");
    setMediaType("");
    resetPreview();

    if (mediaInputRef.current) {
      mediaInputRef.current.value = "";
    }
  };

  const submitPreview = () => {
    setPreviewPage("thanks");
  };

  return (
    <div className={`app theme-${theme}`}>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <span>Pulse</span>
        </div>

        <div className="crumbs">
          <button className="back" type="button">
            <ArrowLeft size={15} />
            Back
          </button>

          <span>›</span>
          <span>Campaigns</span>
          <span>›</span>
          <strong>{campaign.name}</strong>
        </div>

        <div className="top-actions">
          <button
            className="ghost-btn"
            type="button"
            onClick={resetCampaign}
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            className="theme-toggle"
            type="button"
            onClick={() =>
              setTheme((previous) =>
                previous === "light" ? "dark" : "light"
              )
            }
          >
            {theme === "light" ? "☼" : "☾"}
            <span>{theme === "light" ? "Light" : "Dark"}</span>
          </button>

          <button className="primary-btn" type="button">
            <Send size={14} />
            Publish campaign
          </button>

          <div className="avatar">AS</div>
        </div>
      </header>

      <main className="workspace">
        <aside className="sidebar">
          <div className="campaign-card">
            <div className="campaign-icon">
              <MessageCircle size={17} />
            </div>

            <div>
              <span>CAMPAIGN</span>
              <input
                value={campaign.name}
                onChange={(event) =>
                  updateCampaign("name", event.target.value)
                }
                aria-label="Campaign name"
              />
            </div>
          </div>

          <div className="side-label">CONFIGURE</div>

          <button
            className={`nav-item ${
              activeTab === "content" ? "active" : ""
            }`}
            type="button"
            onClick={() => setActiveTab("content")}
          >
            <FileText size={16} />

            <div>
              <strong>Content</strong>
              <small>Questions & messaging</small>
            </div>
          </button>

          <button
            className={`nav-item ${
              activeTab === "styling" ? "active" : ""
            }`}
            type="button"
            onClick={() => setActiveTab("styling")}
          >
            <Palette size={16} />

            <div>
              <strong>Styling</strong>
              <small>Colors & appearance</small>
            </div>
          </button>

          <button className="nav-item" type="button" disabled>
            <Settings2 size={16} />

            <div>
              <strong>Settings</strong>
              <small>Campaign preferences</small>
            </div>

            <span className="soon">SOON</span>
          </button>

          <div className="side-divider" />

          <div className="sidebar-bottom">
            <div className="help-card">
              <CircleHelp size={16} />

              <div>
                <strong>Quick tip</strong>
                <p>
                  Everything you change here appears instantly in the
                  preview.
                </p>
              </div>
            </div>

            <button className="support-btn" type="button">
              Contact support
              <ArrowRight size={13} />
            </button>
          </div>
        </aside>

        <section className="editor">
          <div className="editor-head">
            <div>
              <div className="eyebrow">CAMPAIGN BUILDER</div>

              <h1>Build a better feedback flow.</h1>

              <p>
                Create a simple experience your customers will actually
                want to complete.
              </p>
            </div>

            <div className="completion">
              <div>
                <span>Progress</span>
                <b>{progress}%</b>
              </div>

              <div className="progress">
                <i style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="editor-tabs">
            <button
              type="button"
              className={activeTab === "content" ? "selected" : ""}
              onClick={() => setActiveTab("content")}
            >
              <FileText size={14} />
              Content
            </button>

            <button
              type="button"
              className={activeTab === "styling" ? "selected" : ""}
              onClick={() => setActiveTab("styling")}
            >
              <Palette size={14} />
              Styling
            </button>
          </div>

          {activeTab === "content" ? (
            <ContentPanel
              campaign={campaign}
              updateCampaign={updateCampaign}
              updateOption={updateOption}
              addOption={addOption}
              deleteOption={deleteOption}
              mediaPreviewUrl={mediaPreviewUrl}
              mediaType={mediaType}
              mediaInputRef={mediaInputRef}
              handleMediaUpload={handleMediaUpload}
              removeMedia={removeMedia}
            />
          ) : (
            <StylingPanel
              styling={styling}
              updateStyling={updateStyling}
            />
          )}
        </section>

        <PhonePreview
          campaign={campaign}
          styling={styling}
          theme={theme}
          previewPage={previewPage}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          comment={comment}
          setComment={setComment}
          submitPreview={submitPreview}
          resetPreview={resetPreview}
          mediaPreviewUrl={mediaPreviewUrl}
          mediaType={mediaType}
        />
      </main>
    </div>
  );
}

/* =========================================================
   CONTENT PANEL
   ========================================================= */

function ContentPanel({
  campaign,
  updateCampaign,
  updateOption,
  addOption,
  deleteOption,
  mediaPreviewUrl,
  mediaType,
  mediaInputRef,
  handleMediaUpload,
  removeMedia,
}) {
  return (
    <div className="form-panel">
      <div className="panel-body">
        <div className="section-label">
          <span>01</span>
          Initial feedback
        </div>

        <div className="field">
          <div className="field-head">
            <label>Title</label>
            <span>{campaign.initialTitle.length}/80</span>
          </div>

          <input
            className="text-input"
            value={campaign.initialTitle}
            maxLength={80}
            onChange={(event) =>
              updateCampaign("initialTitle", event.target.value)
            }
          />
        </div>

        <div className="field">
          <div className="field-head">
            <label>Subtitle</label>
            <span>{campaign.initialSubtitle.length}/120</span>
          </div>

          <textarea
            className="text-input textarea"
            value={campaign.initialSubtitle}
            maxLength={120}
            onChange={(event) =>
              updateCampaign("initialSubtitle", event.target.value)
            }
          />
        </div>

        <div className="section-label">
          <span>02</span>
          Feedback page
        </div>

        <div className="field">
          <div className="field-head">
            <label>Rating scale</label>
            <span>1–5 stars</span>
          </div>

          <div className="range-row">
            <input type="range" min="1" max="5" value="5" readOnly />
            <b>5 ratings</b>
          </div>
        </div>

        <div className="field">
          <div className="field-head">
            <label>Feedback options</label>
            <span>Dynamic</span>
          </div>

          {campaign.options.map((option, index) => (
            <div className="option-row" key={`${index}-${option}`}>
              <span className="drag-dots">⋮⋮</span>

              <input
                className="text-input"
                value={option}
                onChange={(event) =>
                  updateOption(index, event.target.value)
                }
              />

              <button
                className="icon-btn"
                type="button"
                onClick={() => deleteOption(index)}
                aria-label={`Delete option ${index + 1}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <button className="add-btn" type="button" onClick={addOption}>
            <Plus size={14} />
            Add feedback option
          </button>
        </div>

        <div className="toggle-row">
          <div>
            <strong>Additional comment</strong>
            <p>Allow customers to add more detail.</p>
          </div>

          <button
            className={`switch ${
              campaign.commentEnabled ? "on" : ""
            }`}
            type="button"
            onClick={() =>
              updateCampaign(
                "commentEnabled",
                !campaign.commentEnabled
              )
            }
            aria-label="Toggle additional comment"
          >
            <span />
          </button>
        </div>

        {campaign.commentEnabled && (
          <div className="field">
            <div className="field-head">
              <label>Comment placeholder</label>
            </div>

            <input
              className="text-input"
              value={campaign.commentPlaceholder}
              onChange={(event) =>
                updateCampaign(
                  "commentPlaceholder",
                  event.target.value
                )
              }
            />
          </div>
        )}

        <div className="field">
          <div className="field-head">
            <label>Submit button text</label>
          </div>

          <input
            className="text-input"
            value={campaign.submitText}
            onChange={(event) =>
              updateCampaign("submitText", event.target.value)
            }
          />
        </div>

        <div className="section-label">
          <span>03</span>
          Thank you page
        </div>

        <div className="field">
          <div className="field-head">
            <label>Media</label>
            <span>PNG, JPG, JPEG, GIF, Lottie</span>
          </div>

          {!campaign.thankYouMedia ? (
            <div className="upload-box">
              <div className="upload-icon">
                <Upload size={16} />
              </div>

              <div>
                <strong>Upload media</strong>
                <p>
                  Add an image or Lottie animation to your thank-you
                  page.
                </p>
              </div>

              <button
                className="small-btn"
                type="button"
                onClick={() => mediaInputRef.current?.click()}
              >
                Browse
              </button>

              <input
                ref={mediaInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.gif,.json,.lottie,image/png,image/jpeg,image/gif,application/json"
                hidden
                onChange={handleMediaUpload}
              />
            </div>
          ) : (
            <div className="upload-box uploaded">
              <div className="upload-icon">
                {mediaType === "lottie" ? (
                  <Sparkles size={16} />
                ) : (
                  <ImageIcon size={16} />
                )}
              </div>

              <div className="uploaded-info">
                <strong>{campaign.thankYouMedia.name}</strong>
                <p>
                  {mediaType === "lottie"
                    ? "Lottie animation uploaded"
                    : "Image uploaded successfully"}
                </p>
              </div>

              <button
                className="remove-media-btn"
                type="button"
                onClick={removeMedia}
              >
                <Trash2 size={13} />
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="field">
          <div className="field-head">
            <label>Title</label>
          </div>

          <input
            className="text-input"
            value={campaign.thankYouTitle}
            onChange={(event) =>
              updateCampaign("thankYouTitle", event.target.value)
            }
          />
        </div>

        <div className="field">
          <div className="field-head">
            <label>Subtitle</label>
          </div>

          <textarea
            className="text-input textarea"
            value={campaign.thankYouSubtitle}
            onChange={(event) =>
              updateCampaign(
                "thankYouSubtitle",
                event.target.value
              )
            }
          />
        </div>

        <div className="field">
          <div className="field-head">
            <label>Button text</label>
          </div>

          <input
            className="text-input"
            value={campaign.thankYouButtonText}
            onChange={(event) =>
              updateCampaign(
                "thankYouButtonText",
                event.target.value
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STYLING PANEL
   ========================================================= */

function StylingPanel({ styling, updateStyling }) {
  const colorFields = [
    ["backgroundColor", "Background"],
    ["titleColor", "Title"],
    ["subtitleColor", "Subtitle"],
    ["buttonColor", "Button"],
    ["buttonTextColor", "Button text"],
    ["selectedRatingColor", "Selected rating"],
    ["unselectedRatingColor", "Unselected rating"],
  ];

  return (
    <div className="form-panel">
      <div className="panel-body">
        <div className="section-label">
          <span>01</span>
          Colors
        </div>

        <div className="two-col">
          {colorFields.map(([key, label]) => (
            <div className="field" key={key}>
              <div className="field-head">
                <label>{label}</label>
              </div>

              <div className="color-control">
                <input
                  type="color"
                  value={styling[key]}
                  onChange={(event) =>
                    updateStyling(key, event.target.value)
                  }
                />

                <input
                  className="text-input color-text"
                  value={styling[key]}
                  onChange={(event) =>
                    updateStyling(key, event.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="section-label">
          <span>02</span>
          Typography
        </div>

        <div className="two-col">
          <div className="field">
            <div className="field-head">
              <label>Title font size</label>
              <span>{styling.titleFontSize}px</span>
            </div>

            <div className="range-row">
              <input
                type="range"
                min="18"
                max="34"
                value={styling.titleFontSize}
                onChange={(event) =>
                  updateStyling(
                    "titleFontSize",
                    Number(event.target.value)
                  )
                }
              />
              <b>{styling.titleFontSize}px</b>
            </div>
          </div>

          <div className="field">
            <div className="field-head">
              <label>Title weight</label>
            </div>

            <select
              className="text-input"
              value={styling.titleFontWeight}
              onChange={(event) =>
                updateStyling(
                  "titleFontWeight",
                  event.target.value
                )
              }
            >
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
              <option value="800">Extra bold</option>
            </select>
          </div>

          <div className="field">
            <div className="field-head">
              <label>Subtitle font size</label>
              <span>{styling.subtitleFontSize}px</span>
            </div>

            <div className="range-row">
              <input
                type="range"
                min="11"
                max="20"
                value={styling.subtitleFontSize}
                onChange={(event) =>
                  updateStyling(
                    "subtitleFontSize",
                    Number(event.target.value)
                  )
                }
              />
              <b>{styling.subtitleFontSize}px</b>
            </div>
          </div>

          <div className="field">
            <div className="field-head">
              <label>Subtitle weight</label>
            </div>

            <select
              className="text-input"
              value={styling.subtitleFontWeight}
              onChange={(event) =>
                updateStyling(
                  "subtitleFontWeight",
                  event.target.value
                )
              }
            >
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
            </select>
          </div>

          <div className="field">
            <div className="field-head">
              <label>Button font size</label>
              <span>{styling.buttonFontSize}px</span>
            </div>

            <div className="range-row">
              <input
                type="range"
                min="11"
                max="18"
                value={styling.buttonFontSize}
                onChange={(event) =>
                  updateStyling(
                    "buttonFontSize",
                    Number(event.target.value)
                  )
                }
              />
              <b>{styling.buttonFontSize}px</b>
            </div>
          </div>

          <div className="field">
            <div className="field-head">
              <label>Button weight</label>
            </div>

            <select
              className="text-input"
              value={styling.buttonFontWeight}
              onChange={(event) =>
                updateStyling(
                  "buttonFontWeight",
                  event.target.value
                )
              }
            >
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
            </select>
          </div>
        </div>

        <div className="section-label">
          <span>03</span>
          Dimensions
        </div>

        <div className="two-col">
          <div className="field">
            <div className="field-head">
              <label>Border radius</label>
              <span>{styling.borderRadius}px</span>
            </div>

            <div className="range-row">
              <input
                type="range"
                min="8"
                max="30"
                value={styling.borderRadius}
                onChange={(event) =>
                  updateStyling(
                    "borderRadius",
                    Number(event.target.value)
                  )
                }
              />
              <b>{styling.borderRadius}px</b>
            </div>
          </div>

          <div className="field">
            <div className="field-head">
              <label>Button width</label>
            </div>

            <select
              className="text-input"
              value={styling.buttonWidth}
              onChange={(event) =>
                updateStyling("buttonWidth", event.target.value)
              }
            >
              <option value="100%">Full width</option>
              <option value="85%">85%</option>
              <option value="70%">70%</option>
              <option value="fit-content">Fit content</option>
            </select>
          </div>

          <div className="field">
            <div className="field-head">
              <label>Button height</label>
              <span>{styling.buttonHeight}px</span>
            </div>

            <div className="range-row">
              <input
                type="range"
                min="38"
                max="60"
                value={styling.buttonHeight}
                onChange={(event) =>
                  updateStyling(
                    "buttonHeight",
                    Number(event.target.value)
                  )
                }
              />
              <b>{styling.buttonHeight}px</b>
            </div>
          </div>
        </div>

        <div className="style-tip">
          <Info size={15} />

          <div>
            <strong>Style tip</strong>
            <p>
              Keep contrast high between your text and background so
              feedback remains easy to read on every device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PHONE PREVIEW
   ========================================================= */

function PhonePreview({
  campaign,
  styling,
  theme,
  previewPage,
  selectedRating,
  setSelectedRating,
  selectedOption,
  setSelectedOption,
  comment,
  setComment,
  submitPreview,
  resetPreview,
  mediaPreviewUrl,
  mediaType,
}) {
  const isDark = theme === "dark";

  const defaultLightBackground = "#ffffff";

  const cardBackground =
    isDark && styling.backgroundColor === defaultLightBackground
      ? "#151923"
      : styling.backgroundColor;

  const titleColor =
    isDark && styling.titleColor === "#252a35"
      ? "#f4f6fa"
      : styling.titleColor;

  const subtitleColor =
    isDark && styling.subtitleColor === "#7b8392"
      ? "#aab2c1"
      : styling.subtitleColor;

  const optionBackground = isDark ? "#181d27" : "#ffffff";
  const optionBorder = isDark ? "#303746" : "#e1e5ed";
  const optionText = isDark ? "#e1e6ee" : "#263044";

  const cardStyle = {
    background: cardBackground,
    color: titleColor,
    borderRadius: `${Math.min(styling.borderRadius + 4, 26)}px`,
  };

  const titleStyle = {
    color: titleColor,
    fontSize: `${Math.max(styling.titleFontSize - 2, 20)}px`,
    fontWeight: styling.titleFontWeight,
  };

  const subtitleStyle = {
    color: subtitleColor,
    fontSize: `${Math.max(styling.subtitleFontSize - 1, 12)}px`,
    fontWeight: styling.subtitleFontWeight,
  };

  return (
    <section className="preview-area">
      <div className="preview-top">
        <div>
          <div className="eyebrow">EXPERIENCE</div>
          <h2>Live mobile preview</h2>
        </div>

        <div className="preview-pill">
          <span className="live-dot" />
          Live
        </div>
      </div>

      <div className="phone-wrap">
        <div className="phone">
          <div className="phone-notch" />

          <div className="phone-screen">
            <div className="phone-content">
              <div className="mini-brand">
                <div className="brand-dot">P</div>
                <span>Pulse</span>
              </div>

              {previewPage === "feedback" ? (
                <div className="preview-card" style={cardStyle}>
                  <div className="preview-badge">
                    <MessageCircle size={12} />
                    Feedback
                  </div>

                  <h3 style={titleStyle}>
                    {campaign.initialTitle}
                  </h3>

                  <p style={subtitleStyle}>
                    {campaign.initialSubtitle}
                  </p>

                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((rating) => {
                      const active = selectedRating >= rating;

                      return (
                        <button
                          type="button"
                          key={rating}
                          onClick={() =>
                            setSelectedRating(rating)
                          }
                          aria-label={`Rate ${rating} out of 5`}
                        >
                          <svg
                            width="36"
                            height="36"
                            viewBox="0 0 24 24"
                            fill={active ? styling.selectedRatingColor : "none"}
                            stroke={
                              active
                                ? styling.selectedRatingColor
                                : styling.unselectedRatingColor
                            }
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 3.5l2.63 5.33 5.88.86-4.25 4.14 1 5.86L12 16.92l-5.26 2.77 1-5.86L3.5 9.69l5.88-.86L12 3.5z" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>

                  <div className="rating-caption">
                    <span>Not likely</span>
                    <span>Very likely</span>
                  </div>

                  <div className="option-preview">
                    {campaign.options.map((option) => (
                      <button
                        type="button"
                        key={option}
                        className={
                          selectedOption === option ? "chosen" : ""
                        }
                        onClick={() => setSelectedOption(option)}
                        style={{
                          background:
                            selectedOption === option
                              ? isDark
                                ? "rgba(99,91,255,.15)"
                                : "#f1efff"
                              : optionBackground,
                          borderColor:
                            selectedOption === option
                              ? styling.selectedRatingColor
                              : optionBorder,
                          color:
                            selectedOption === option
                              ? styling.selectedRatingColor
                              : optionText,
                        }}
                      >
                        <span>{option}</span>
                        <ChevronRight size={15} />
                      </button>
                    ))}
                  </div>

                  {campaign.commentEnabled && (
                    <textarea
                      value={comment}
                      onChange={(event) =>
                        setComment(event.target.value)
                      }
                      placeholder={campaign.commentPlaceholder}
                    />
                  )}

                  <button
                    type="button"
                    className="submit-preview"
                    onClick={submitPreview}
                    style={{
                      width: styling.buttonWidth,
                      height: `${styling.buttonHeight}px`,
                      borderRadius: `${styling.borderRadius}px`,
                      background: styling.buttonColor,
                      color: styling.buttonTextColor,
                      fontSize: `${styling.buttonFontSize}px`,
                      fontWeight: styling.buttonFontWeight,
                    }}
                  >
                    {campaign.submitText}
                    <ArrowRight size={15} />
                  </button>

                  <span className="privacy">
                    Your feedback is private
                  </span>
                </div>
              ) : (
                <div className="thanks-card" style={cardStyle}>
                  {mediaPreviewUrl ? (
                    mediaType === "image" ? (
                      <div className="thankyou-media">
                        <img
                          src={mediaPreviewUrl}
                          alt="Thank you media"
                        />
                      </div>
                    ) : (
                      <div className="thankyou-media lottie-placeholder">
                        <div className="lottie-icon">
                          <Sparkles size={20} />
                        </div>

                        <strong>Lottie animation</strong>
                        <span>
                          {campaign.thankYouMedia?.name}
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="success-ring">
                      <Check size={28} />
                    </div>
                  )}

                  <h3 style={titleStyle}>
                    {campaign.thankYouTitle}
                  </h3>

                  <p style={subtitleStyle}>
                    {campaign.thankYouSubtitle}
                  </p>

                  <button
                    type="button"
                    className="submit-preview"
                    onClick={resetPreview}
                    style={{
                      width: styling.buttonWidth,
                      height: `${styling.buttonHeight}px`,
                      borderRadius: `${styling.borderRadius}px`,
                      background: styling.buttonColor,
                      color: styling.buttonTextColor,
                      fontSize: `${styling.buttonFontSize}px`,
                      fontWeight: styling.buttonFontWeight,
                    }}
                  >
                    {campaign.thankYouButtonText}
                    <RotateCcw size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="phone-home" />
        </div>
      </div>

      <div className="preview-note">
        <Sparkles size={12} />
        This preview updates as you edit
      </div>
    </section>
  );
}

export default App;