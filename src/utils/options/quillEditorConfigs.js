export const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["clean"],
    ],
  },

  // Image paste + drop support
  clipboard: {
    matchVisual: false,
  },

  // Smooth scroll
  scrollingContainer: null,
};

export const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "indent",
  "align",
  "color",
  "background",
  "link",
  "image",
];
