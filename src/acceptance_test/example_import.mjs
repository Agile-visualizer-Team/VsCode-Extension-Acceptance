// How to install package -> npm install @agile-visualizer-team/visualizer-asp
// How to publish package -> npm publish --registry https://agilevisualizerteam.jfrog.io/artifactory/api/npm/avs_releasable-npm/ realese/visualizer-asp/
import { MatrixCreator } from "@agile-visualizer-team/agile_visualizer_matrix_visualizaton/src/matrix_visualization.js";
let script = new MatrixCreator();

script.run_script();
// import { MatrixCreator } from "@agile-visualizer-team/vscode-extension-playground/src/matrix_visualization";
