import { expect } from "chai";
import sinon from "sinon";
import { MatrixCreator } from "@agile-visualizer-team/visualizer-asp/src/visualizer-matrix/src/matrix_visualization";

const answer_sets:JSON = JSON.parse(`[
    {
        "as" : [  "cell(0,1,peppe)",  "cell2(0,0,cell21) ", "cell2(0,1,cell22)" ],
        "cost" : "1@2"
    },
    {
        "as" : [ "cell(0,0,ciao) ", "cell(0,1,ciao)", "cell(0,2,ciao)",  "cell(1,0,ciao1) ", "cell(1,1,ciao12)", "cell(1,2,ciao)"  ],
        "cost" : "1@2"
    },
    {
        "as" : [ "cell3(0,0,ciao) ", "cell3(0,1,peppe)",  "cell3(0,0,cell21) ", "cell3(0,1,cell22)" ],
        "cost" : "1@2"
    }
]`);





describe('acceptance tests ', () => { // the tests container


    it('as a user i want to create a matrix in light mode from an answer set and a configuration file', () => { // the single test
        const config_file = JSON.parse(`{
            "cell" : ["cell", "cell2"],
            "maxNumOfAnswerSetToConvert" : 4,
            "table_field_mapping": {
                "0":"row",
                "1": "column",
        
                "2":"Value"
            },
            "style": {
                "header_color": "#b41b22",
                "header_font_size": 20,
                "header_font_family": "Arial",
                "header_font_weight": "bold",
                "dark_mode": false
              }
        }
        `);
        let matrix_creator: MatrixCreator = new MatrixCreator();
        sinon.stub(matrix_creator, 'get_config_style').returns({  header_color: "#b41b22",
        header_font_size: 20,
        header_font_family: "Arial",
        header_font_weight: "bold",
        dark_mode: true });
        //I need to reassign because when the object is created the method is alredy been called.
        //So, in order to give the correct value, I need to assign again.
        matrix_creator.style = matrix_creator.get_config_style();
        matrix_creator.base_styling = matrix_creator.get_base_styling();  
        
        sinon.stub(matrix_creator, 'config_file').value(config_file);
        sinon.stub(matrix_creator, 'answer_sets').value(answer_sets);
        
        let create_image_from_html_mock = sinon.stub(matrix_creator, 'create_image_from_html')
        

        matrix_creator.run_script(matrix_creator.answer_sets)
        
        
        expect(create_image_from_html_mock.getCall(0).args[1].replace(/\s/g, "")).to.eql('<html><head><style>html{background-color:#101010;color:#e1e1e1;font-family:Arial;}strong{color:#e1e1e1;font-size:20px;}body{background-color:#101010;color:#e1e1e1;margin:1em;display:flex;justify-content:space-evenly;align-items:center;gap:20px;padding:1em;flex-direction:column;margin:1em;padding-top:1em;height:-webkit-fill-available;height:auto;}td{padding:12px15px;}thead{background-color:#b41b22;color:#ffffff;width:100%;font-size:20;font-family:Arial;font-weight:bold;text-align:center;display:table-caption;}tbodytr{border-bottom:1pxsolid#e1e1e1;background-color:#252525;}table{border-collapse:collapse;margin:1em;width:100%;font-size:0.9em;font-family:sans-serif;min-width:400px;box-shadow:0px10px15px-5pxrgba(200,200,200,0.10);color:#e1e1e1;}.titolo{display:flex;justify-content:space-around;align-items:center;}</style></head><body><table><thead><trclass="titolo"><th>Answerset</th><th>Mappedvalue:cell</th></tr></thead><tbody><tr><td></td><td>0</td><td>1</td></tr><tr><td>0</td><td>Notdefined</td><td>peppe</td></tr></tbody></table><table><thead><trclass="titolo"><th>Answerset</th><th>Mappedvalue:cell2</th></tr></thead><tbody><tr><td></td><td>0</td><td>1</td></tr><tr><td>0</td><td>cell21</td><td>cell22</td></tr></tbody></table></body></html>'.replace(/\s/g, ""))
    
    
    });


    it('as a user i want to create a matrix in light mode from an answer set and a configuration file', () => { // the single test
        const config_file = JSON.parse(`{
            "cell" : ["cell", "cell2"],
            "maxNumOfAnswerSetToConvert" : 4,
            "table_field_mapping": {
                "0":"row",
                "1": "column",
        
                "2":"Value"
            },
            "style": {
                "header_color": "#b41b22",
                "header_font_size": 20,
                "header_font_family": "Arial",
                "header_font_weight": "bold",
                "dark_mode": false
              }
        }
        `);
        let matrix_creator: MatrixCreator = new MatrixCreator();
        sinon.stub(matrix_creator, 'get_config_style').returns({  header_color: "#b41b22",
        header_font_size: 20,
        header_font_family: "Arial",
        header_font_weight: "bold",
        dark_mode: false });
        //I need to reassign because when the object is created the method is alredy been called.
        //So, in order to give the correct value, I need to assign again.
        matrix_creator.style = matrix_creator.get_config_style();
        matrix_creator.base_styling = matrix_creator.get_base_styling();  
        
        sinon.stub(matrix_creator, 'config_file').value(config_file);
        sinon.stub(matrix_creator, 'answer_sets').value(answer_sets);
        
        let create_image_from_html_mock = sinon.stub(matrix_creator, 'create_image_from_html')
        

        matrix_creator.run_script(matrix_creator.answer_sets)
        
        
        expect(create_image_from_html_mock.getCall(0).args[1].replace(/\s/g, "")).to.eql('<html><head><style>html{background-color:#ebebeb;color:#000000;font-family:Arial;}strong{color:#000000;font-size:20px;}body{background-color:#ebebeb;color:#000000;margin:1em;display:flex;justify-content:space-evenly;align-items:center;gap:20px;padding:1em;flex-direction:column;margin:1em;padding-top:1em;height:-webkit-fill-available;height:auto;}td{padding:12px15px;}thead{background-color:#b41b22;color:#ffffff;width:100%;font-size:20;font-family:Arial;font-weight:bold;text-align:center;display:table-caption;}tbodytr{border-bottom:1pxsolid#878787;background-color:#f8f8f8;}table{border-collapse:collapse;margin:1em;width:100%;font-size:0.9em;font-family:sans-serif;min-width:400px;box-shadow:0px10px15px-5pxrgba(0,0,0,0.15);color:#000000;}.titolo{display:flex;justify-content:space-around;align-items:center;}</style></head><body><table><thead><trclass="titolo"><th>Answerset</th><th>Mappedvalue:cell</th></tr></thead><tbody><tr><td></td><td>0</td><td>1</td></tr><tr><td>0</td><td>Notdefined</td><td>peppe</td></tr></tbody></table><table><thead><trclass="titolo"><th>Answerset</th><th>Mappedvalue:cell2</th></tr></thead><tbody><tr><td></td><td>0</td><td>1</td></tr><tr><td>0</td><td>cell21</td><td>cell22</td></tr></tbody></table></body></html>'.replace(/\s/g, ""))
    
    
    });


    afterEach(() => {
        //Needed in order to restore the stub and the methods that have been mocked
        sinon.restore();
    });
    
});