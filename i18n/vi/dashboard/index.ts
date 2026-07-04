import sidebar from "./sidebar";
import timeline from "./timeline";
import chat from "./chat";
import sprint from "./sprint";
import channel from "./channel";
import project from "./project";
import workspace from "./workspace";
import backlog from "./backlog";
import planning from "./planning";
import issue from "./issue";
import common from "./common";

const dashboard = {
  ...common,
  sidebar,
  timeline,
  chatRightPanel: chat,
  sprint,
  channel,
  project,
  workspace,
  backlog,
  planning,
  issue,
} as const;

export default dashboard;
