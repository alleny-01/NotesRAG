export type Citation = {
  id: number;
  page: string;
  title: string;
  text: string;
};

export type FeaturePanel = {
  number: string;
  title: string;
  text: string;
  tone: "panel-paper" | "panel-ink" | "panel-violet";
};
