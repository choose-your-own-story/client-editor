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
        "text-rotation": "autorotate",
        "text-wrap": "ellipsis",
        "text-max-width": 150
      }
    }
  ]
};

export default config;
