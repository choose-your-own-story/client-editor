const config = {
  style: [
    {
      selector: "node",
      style: {
        "background-color": "data(color)",
        label: "data(label)"
      }
    },
    {
      selector: "edge",
      style: {
        label: "data(label)",
        width: 3,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
        "classes": "data(classes)"
      }
    }
  ]
};

export default config;
