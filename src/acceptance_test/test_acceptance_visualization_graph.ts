import { validateTemplateSchema } from "@agile-visualizer-team/visualizer-asp/src/visualizer-graph/src/schema-validators";
import { expect } from "chai";
import { GraphParser } from "@agile-visualizer-team/visualizer-asp/src/visualizer-graph/src/parser";
import { Expression, ExpressionEvaluator } from "@agile-visualizer-team/visualizer-asp/src/visualizer-graph/src/expressions";
import { GraphVariables } from "@agile-visualizer-team/visualizer-asp/src/visualizer-graph/src/models";


describe("SCHEMA VALIDATORS ACCEPTANCE TESTS", () => {

    it("should evaluate properly a well formatted schema ", ()=> {
        //GIVEN A well formatted template
        const RIGHT_SCHEMA = {
            "template": "graph",
            "layout": "dagre",
            "nodes": [
                {
                    "atom": {
                        "name": "inNode",
                        "variables": ["label"]
                    },
                    "style": {
                        "color": {
                            "all": "green"
                        }
                    }
                },
                {
                    "atom": {
                        "name": "outNode",
                        "variables": ["label"]
                    },
                    "style": {
                        "color": {
                            "all": "grey"
                        }
                    }
                }
            ],
            "edges": [
                {
                    "atom": {
                        "name": "inEdge",
                        "variables": ["from", "to", "weight"]
                    },
                    "style": {
                        "color": {
                            "if": [
                                {"variable": "weight", "gte": 6, "then": "red"},
                                {"variable": "weight", "gte": 4, "then": "orange"},
                                {"variable": "weight", "gte": 2, "then": "yellow"}
                            ],
                            "else": "green"
                        },
                        "oriented": true
                    }
                },
                {
                    "atom": {
                        "name": "outEdge",
                        "variables": ["from", "to", "weight"]
                    },
                    "style": {
                        "color": "grey",
                        "oriented": false
                    }
                }
            ]
        };
        //WHEN I try to validate the template
        const res = validateTemplateSchema(RIGHT_SCHEMA);
        //THEN The template should be considered valid
        expect(res).to.be.true;
    });
    it("should evaluate properly the schema using defaults value if not provided", ()=> {
        //GIVEN A template with some missing parameters
        const MISSING_VAR_SCHEMA = {
            template: "graph",
            nodes: [{
                atom: {
                },
                style:{
                    color:{
                    }
                }
            }],
            edges: [{
                atom: {
                    name: "edge",
                    variables: ["from","to","weight","color"]
                },
                style:{
                    color: "green",
                    oriented: true
                }
            }]
        };
        //WHEN I try to validate the template
        validateTemplateSchema(MISSING_VAR_SCHEMA);
        //THEN I expect that the missing parameters has been filled with the right values
        expect((<any>MISSING_VAR_SCHEMA).nodes[0].atom.name).eq("node");
        expect((<any>MISSING_VAR_SCHEMA).nodes[0].atom.variables).deep.equal(['label']);
    });
    it("should accept a template with 'color' parameters as string", ()=>{
        //GIVEN A template with 'color' parameters as string
        const COLOR_AS_STRING_SCHEMA = {
            "template": "graph",
            "layout": "dagre",
            "nodes": [
                {
                    "atom": {
                        "name": "inNode",
                        "variables": ["label"]
                    },
                    "style": {
                        "color": {
                            "root": "green",
                            "nonRoot": "blue",
                            "leaf": "fuchsia"
                        }
                    }
                },
                {
                    "atom": {
                        "name": "outNode",
                        "variables": ["label"]
                    },
                    "style": {
                        "color": {
                            "all": "grey"
                        }
                    }
                }
            ],
            "edges": [
                {
                    "atom": {
                        "name": "inEdge",
                        "variables": ["from", "to", "weight"]
                    },
                    "style": {
                        "color": "blue",
                        "oriented": true
                    }
                },
                {
                    "atom": {
                        "name": "outEdge",
                        "variables": ["from", "to", "weight"]
                    },
                    "style": {
                        "color": "grey",
                        "oriented": false
                    }
                }
            ]
        };
        //WHEN I try to validate the template
        //THEN The template should be considered valid
        expect(validateTemplateSchema(COLOR_AS_STRING_SCHEMA)).to.be.true;
    });
    it("should accept a template with 'color' parameters as expression", ()=>{
        //GIVEN A template with 'color' parameters as expression
        const COLOR_AS_EXPRESSION_SCHEMA = {
            "template": "graph",
            "layout": "dagre",
            "nodes": [
                {
                    "atom": {
                        "name": "inNode",
                        "variables": ["label"]
                    },
                    "style": {
                        "color": {
                            "all": {
                                "if": [
                                    {"variable": "label", "matches": "a", "then": "green"},
                                    {"variable": "label", "matches": "d", "then": "blue"},
                                    {"variable": "label", "matches": "h", "then": "fuchsia"}
                                ],
                                "else": "orange"
                            }
                        }
                    }
                },
                {
                    "atom": {
                        "name": "outNode",
                        "variables": ["label"]
                    },
                    "style": {
                        "color": {
                            "all": "grey"
                        }
                    }
                }
            ],
            "edges": [
                {
                    "atom": {
                        "name": "inEdge",
                        "variables": ["from", "to", "weight"]
                    },
                    "style": {
                        "color": {
                            "if": [
                                {"variable": "weight", "gte": 6, "then": "red"},
                                {"variable": "weight", "gte": 4, "then": "orange"},
                                {"variable": "weight", "gte": 2, "then": "yellow"}
                            ],
                            "else": "green"
                        },
                        "oriented": true
                    }
                },
                {
                    "atom": {
                        "name": "outEdge",
                        "variables": ["from", "to", "weight"]
                    },
                    "style": {
                        "color": "grey",
                        "oriented": false
                    }
                }
            ]
        };
        //WHEN I try to validate the template
        //THEN The template should be considered valid
        expect(validateTemplateSchema(COLOR_AS_EXPRESSION_SCHEMA)).to.be.true;
    });
});

describe("PARSER ACCEPTANCE TESTS", ()=>{
    const GOOD_TEMPLATE = {
    "template": "graph",
    "nodes": [
        {
            "atom": {
                "name": "node",
                "variables": ["label"]
            },
            "style": {
                "color": {
                    "root": "yellow",
                    "leaf": "fuchsia",
                    "nonRoot": {
                        "if": [
                            {"variable": "label", "matches": "a", "then": "green"},
                            {"variable": "label", "matches": "g", "then": "fuchsia"}
                        ],
                        "else": "red"
                    }
                }
            }
        }
    ],
    "edges": [
        {
            "atom": {
                "name": "edge",
                "variables": ["from", "to", "weight"]
            },
            "style": {
                "color": "green",
                "oriented": true
            }
        }
    ]
    };
    const GOOD_AS = [
        {
            "as": [
                "node(a)",
                "node(b)",
                "node(c)",
                "node(d)",
                "node(e)",
                "node(f)",
                "node(g)",
                "edge(a,b,10)",
                "edge(a,c,5)",
                "edge(b,d,6)",
                "edge(b,e,7)",
                "edge(b,f,5)",
                "edge(c,d,4)",
                "edge(d,g,3)"
            ],
            "cost": "1@2"
        },
        {
            "as": [
                "node(a)",
                "node(b)",
                "node(g)",
                "edge(a,b,10)",
                "edge(b,g,5)",
                "edge(a,g,3)"
            ],
            "cost": "1@2"
        }
    ];
    it("should generate a correct graph from a template", () =>{
        //GIVEN A parser, an answer set template and a syntax template
        const parser = new GraphParser(GOOD_TEMPLATE, GOOD_AS);
        //WHEN I try to evaluate them
        const res = parser.parse();
        //THEN I expect to recive as first node 'a' with color 'yellow'
        expect(res[0].nodes[0].label).to.be.equal("a");
        expect(res[0].nodes[0].color).to.be.equal("yellow");
    });
    it("given the same input, it will always return the same output", () => {
        //GIVEN The same input to two different parser
        const parser1 = new GraphParser(GOOD_TEMPLATE, GOOD_AS);
        const parser2 = new GraphParser(GOOD_TEMPLATE, GOOD_AS);
        //WHEN I try to evaluate them
        const res1 = parser1.parse();
        const res2 = parser2.parse();
        //THEN The answers must be always the same
        expect(res1.length).to.be.eq(res2.length);
        for (let i = 0; i < res1.length; ++i) {
            for (let j = 0; j < res1[i].nodes.length; ++j) {
                expect(res1[i].nodes[j].label).to.be.eq(res2[i].nodes[j].label);
            }
            // noinspection DuplicatedCode
            for (let j = 0; j < res1[i].edges.length; ++j) {
                expect(res1[i].edges[j].from).to.be.eq(res2[i].edges[j].from);
                expect(res1[i].edges[j].to).to.be.eq(res2[i].edges[j].to);
                expect(res1[i].edges[j].weight).to.be.eq(res2[i].edges[j].weight);
            }
        }
    });
    it("should create, given two template with from-to switched, create a mirror graph", () => {
        const FROM_TO = {
            "template": "graph",
            "nodes": [{
                "atom": {
                    "name": "node",
                    "variables": ["label"]
                },
                "style": {
                    "color": {
                        "root": "yellow",
                        "leaf": "fuchsia",
                        "nonRoot": "blue"
                    }
                }
            }],
            "edges": [{
                "atom": {
                    "name": "edge",
                    "variables": ["from", "to", "weight"]
                },
                "style": {
                    "color": "green"
                }
            }]
        };
        const TO_FROM = {
            "template": "graph",
            "nodes": [{
                "atom": {
                    "name": "node",
                    "variables": ["label"]
                },
                "style": {
                    "color": {
                        "root": "yellow",
                        "leaf": "fuchsia",
                        "nonRoot": "blue"
                    }
                }
            }],
            "edges": [{
                "atom": {
                    "name": "edge",
                    "variables": ["to", "from", "weight"]
                },
                "style": {
                    "color": "green"
                }
            }]
        };
        const AS = [
            {
                "as": [
                    "node(a)",
                    "node(b)",
                    "node(g)",
                    "edge(a,b,10)",
                    "edge(b,g,5)",
                    "edge(a,g,3)"
                ]
            }];
        //GIVEN A parser with a FROM_TO template and a parser with TO_FROM template
        const parserTO = new GraphParser(TO_FROM, AS);
        const parserFROM = new GraphParser(FROM_TO, AS);
        //WHEN I try to evaluate them
        const resTO = parserTO.parse();
        const resFROM = parserFROM.parse();
        //THEN I expect to have mirrored results
        for (let i = 0; i < resTO.length; ++i) {
            for (let j = 0; j < resTO[i].edges.length; ++j) {
                expect(resTO[i].edges[j].from).to.be.eq(resFROM[i].edges[j].to);
                expect(resTO[i].edges[j].to).to.be.eq(resFROM[i].edges[j].from);
                expect(resTO[i].edges[j].weight).to.be.eq(resFROM[i].edges[j].weight);
            }
        }
    });
});

describe("EXPRESSIONS ACCEPTANCE TESTS", ()=>{
    it("should check, given an input, if it MATCHES exactly with the variable in the expression", () => {
        //GIVEN A "match" expression and a variable
        const expression: Expression = {
            if: [{variable: 'a', matches: 'test', then: 'foo'}], else: 'output'
        };
        const variables: GraphVariables = {
            a: 'test'
        };
        //WHEN I try to evaluate them
        //THEN The expression should return 'foo'
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('foo');
    });
    it("should check, given an input, if it IMATCHES (insensitive) with the variable in the expression", () => {
        //GIVEN A "imatch" expression and a variable
        const expression: Expression = {
            if: [{variable: 'a', imatches: 'test', then: 'foo'}], else: 'output'
        };
        const variables: GraphVariables = {
            a: 'TEST'
        };
        //WHEN I try to evaluate them
        //THEN The expression should return 'foo'
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('foo');
    });
    it("should check, given an input, if it is CONTAINED in the variable in the expression", () => {
        //GIVEN A "contain" expression and a variable
        const expression: Expression = {
            if: [{variable: 'a', contains: 'example_of_contain', then: 'foo'}], else: 'output'
        };
        const variables: GraphVariables = {
            a: 'try'
        };
        //WHEN I try to evaluate them
        //THEN The expression should return 'output'
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('output');
    });
    it("should check, given an input, if it is ICONTAINED (insensitive) in the variable in the expression", () => {
        //GIVEN A "icontain" expression and a variable
        const expression: Expression = {
            if: [{variable: 'a', icontains: 'cool', then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = {
            a: 'MYCOOLGRAPH'
        };
        //WHEN I try to evaluate them
        //THEN The expression should return 'foo'
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('foo');
    });
    it("should check, given an input, if it is LOWER THAN the variable in the expression", () => {
        //GIVEN A "lt" expression and a variable
        const expression: Expression = {
            if: [{variable: 'a', lt: 5, then: 'foo'}], else: 'output'
        };
        const variables: GraphVariables = {
            a: 2
        };
        //WHEN I try to evaluate them
        //THEN The expression should return 'foo'
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('foo');
    });
    it("should check, given an input, if it is LOWER THAN OR EQUAL to the variable in the expression", () => {
        //GIVEN A "lte" expression and a variable
        const expression: Expression = {
            if: [{variable: 'a', lte: 5, then: 'foo'}], else: 'output'
        };
        const variables: GraphVariables = {
            a: 5
        };
        //WHEN I try to evaluate them
        //THEN The expression should return 'foo'
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('foo');
    });
    it("should check, given an input, if it is GREATER THAN the variable in the expression", () => {
        //GIVEN A "gt" expression and a variable
        const expression: Expression = {
            if: [{variable: 'a', gt: 5, then: 'foo'}], else: 'output'
        };
        const variables: GraphVariables = {
            a: 2
        };
        //WHEN I try to evaluate them
        //THEN The expression should return 'output'
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('output');
    });
    it("should check, given an input, if it is GREATER THAN OR EQUAL to the variable in the expression", () => {
        //GIVEN A "gte" expression and a variable
        const expression: Expression = {
            if: [{variable: 'a', gte: 5, then: 'foo'}], else: 'output'
        };
        const variables: GraphVariables = {
            a: 3
        };
        //WHEN I try to evaluate them
        //THEN The expression should return 'output'
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('output');
    });
});

