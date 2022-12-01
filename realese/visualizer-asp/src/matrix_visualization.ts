import path = require("path");

export default class MatrixCreator {
  answer_sets = require("./answers_sets.json");
  config_file = require("./config.json");
  fs = require("fs");
  table = require("table");
  node_html_to_image = require("node-html-to-image");
  undefined_error_string: string = "this data cannot be undefined";

  /**
   * It takes a list of atoms, a mapped_atom (the atom choosen by user to be mapped on the table), and a table_html string
   * it tries to create a table the mapped atom, if the answer set contains this atom it will create a table
   *
   * If the answer set doesn't contain the atom the user will see "No value found in answer set for: (name of the mapped atom)"
   * @param {string[]} atoms_list - the list of atoms in the answer set
   * @param {string} mapped_atom - the value of the atom we want to map
   * @param {string} table_html - the html code of the table
   * @returns A string containing the HTML code for the table.
   */

  create_html_table_for_mapped_atom(
    atoms_list: string[],
    mapped_atom: string,
    table_html: string
  ): string {
    let rows_list: Array<number> = new Array();
    let columns_list: Array<number> = new Array();
    let atoms_splitted_array: Array<Array<string>> = new Array();
    if (
      this.retrieve_matrix_cell_as_tuple(
        atoms_list,
        rows_list,
        columns_list,
        atoms_splitted_array,
        mapped_atom
      )
    ) {
      if (rows_list.length != 0 && columns_list.length != 0) {
        let matrix: Array<Array<string>> = new Array();
        matrix = this.init_matrix_rows_and_columns(
          matrix,
          rows_list,
          columns_list
        );
        this.fill_matrix_with_values(atoms_splitted_array, matrix);
        table_html += this.create_table_html(matrix, mapped_atom);
      } else {
        table_html +=
          "<strong>No value found in answer set for: " +
          mapped_atom +
          "</strong><br>";
      }
    } else {
      table_html =
        "<strong>Problem in matrix creating, make sure data is correct</strong>";
    }

    return table_html;
  }

  /**
   * It takes a list of atoms, a list of mapped atoms, and an index, and creates an image from the html
   * table that it creates
   * @param {string[]} atoms_list - list of atoms
   * @param {string[]} mapping_list - the list of atoms that are mapped to the current atom
   * @param {number} index - the index of the matrix in the list of matrices
   */
  create_matrix_from_atoms_list(
    atoms_list: string[],
    mapping_list: string[],
    index: number
  ) {
    let table_html: string = "";
    let self = this;
    mapping_list.forEach(function (mapped_atom) {
      table_html = self.create_html_table_for_mapped_atom(
        atoms_list,
        mapped_atom,
        table_html
      );
    });
    let html_to_convert_in_image =
      this.create_html_to_convert_in_image(table_html);

    this.create_image_from_html(index, html_to_convert_in_image);
  }

  /**
   * It takes an index and an html string as input, and it creates an image from the html string. It stores this image in the current working folder
   *
   * @param {number} index - the index of the answer set matrix
   * @param {string} html_to_convert_in_image - the html string that you want to convert to an image
   * @returns A boolean value.
   */
  create_image_from_html(index: number, html_to_convert_in_image: string) {
    this.node_html_to_image({
      output: path.join(
        "D:",
        "AlexFazio64",
        "Downloads",
        "answer_set_matrix_" + index.toString() + ".png"
      ),
      html: html_to_convert_in_image,
      puppeteerArgs: { executablePath: process.env.CHROME_PATH },
    }).then(() => {
      console.log("The image was created succesfully!");
      return true;
    });

    return false;
  }

  /**
   * It takes a matrix, a list of rows and a list of columns (initally empty), and returns a matrix with the same
   * dimensions as the input matrix, but with all the values set to "Not defined" (just to initialize, in case the answer set doesn't contain
   * all matrix cells)
   * @param {string[][]} matrix - The matrix that will be returned.
   * @param {number[]} rows_list - a list of all the rows that are defined in the input file
   * @param {number[]} columns_list - A list of all the columns in the table.
   * @returns A matrix with the dimensions of the largest row and column in the input.
   */
  init_matrix_rows_and_columns(
    matrix: string[][],
    rows_list: number[],
    columns_list: number[]
  ) {
    if (rows_list == undefined)
      throw new Error(this.undefined_error_string + " rows_list");
    if (columns_list == undefined)
      throw new Error(this.undefined_error_string + " columns_list");

    if (rows_list.length != 0 && columns_list.length != 0) {
      matrix = new Array(Math.max.apply(null, rows_list) + 1);
      for (var i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(Math.max.apply(null, columns_list) + 1);
        for (var j = 0; j < Math.max.apply(null, columns_list) + 1; j++) {
          matrix[i][j] = "Not defined";
        }
      }
    }

    return matrix;
  }

  /**
   * It takes the HTML of the table a the entire HTML (with the style we choose) of the page which
   * will be converted into an image
   * @param {string} table_html - The HTML of the table you want to convert to an image.
   * @param {number} index - The index of the table in the HTML file.
   * @returns the html that will be converted into an image.
   */
  create_html_to_convert_in_image(table_html: string): string {
    if (table_html === undefined) return "";
    let html =
      `<html>
    <head>
    <style>
      td {
        padding: 12px 15px;
      }
      thead{
        background-color: #b41b22;
        color: #ffffff;
        width: 100%;
        text-align: center;
        display: table-caption;
      }
      tbody tr {
        border-bottom: 1px solid #dddddd;
      }
      table {
        border-collapse: collapse;
        margin: auto;
        font-size: 0.9em;
        font-family: sans-serif;
        min-width: 400px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
      }
      body {
        margin: 1em;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        flex-direction: column;
        margin: 1em;
        padding-top: 1em;
      }

      .titolo{
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    </style>
      
    </head>
    <body>` +
      table_html +
      `</body>
  </html>
  `;
    return html;
  }

  /**
   * It takes an array of arrays of strings (array that contains all the cells as an array [i,j,value] and a matrix of strings
   * (the matrix we want to fill with the atoms values)
   * and fills the matrix with the values from the array
   * @param {string[][]} atoms_splitted_matrix - This is the array that contains the atoms that are split
   * by the ',' character.
   * @param {string[][]} matrix - The matrix that will be filled with the values.
   */
  fill_matrix_with_values(
    atoms_splitted_matrix: string[][],
    matrix: string[][]
  ): boolean {
    if (atoms_splitted_matrix === undefined) return false;
    if (atoms_splitted_matrix.length === 0) return false;
    if (matrix === undefined) return false;

    atoms_splitted_matrix.forEach(function (atom) {
      if (atom.length == 3) {
        let row: number = Number(atom[0]);
        let column: number = Number(atom[1]);
        matrix[row][column] = atom[2];
      }
    });
    return true;
  }

  /**
   * It takes a list of atoms, and for each atom that contains a the mapped atom name chosed from the user,
   *  it extracts the row and column number of that cell, and adds them to the rows_list and columns_list (we will use it to
   * define the correct matrix number of rows and columns)
   * after this this method puts in atoms_splitted_array all the atoms (mapped) as an array [i,j, value] (strings)
   * @param {string[]} atoms_list - string[]: This is the list of atoms that you want to retrieve the
   * matrix cell from.
   * @param {number[]} rows_list - number[] - this is an array of numbers that will contain the row
   * numbers of the matrix cells
   * @param {number[]} columns_list - number[]
   * @param {string[][]} atoms_splitted_matrix - This is the array that will contain the values of the
   * matrix cell.
   * @param {string} cell_name - the name of the cell you want to retrieve
   */
  retrieve_matrix_cell_as_tuple(
    atoms_list: string[],
    rows_list: number[],
    columns_list: number[],
    atoms_splitted_matrix: string[][],
    cell_name: string
  ): boolean {
    /* Checking if the input is valid. */
    if (atoms_list == undefined) return false;
    if (rows_list == undefined || rows_list.length !== 0) return false;
    if (columns_list == undefined || columns_list.length !== 0) return false;
    if (atoms_splitted_matrix == undefined) return false;
    if (atoms_splitted_matrix.length !== 0) return false;

    for (let k: number = 0; k < atoms_list.length; k++) {
      if (atoms_list[k].includes(cell_name + "(")) {
        let atom_value: string = atoms_list[k].substring(
          atoms_list[k].indexOf("(") + 1,
          atoms_list[k].lastIndexOf(")")
        );

        //console.log(atom);
        let atom_values_tuple: string[] = atom_value.split(",");

        rows_list.push(Number(atom_values_tuple[0]));
        columns_list.push(Number(atom_values_tuple[1]));
        atoms_splitted_matrix.push(atom_values_tuple);
      }
    }

    return true;
  }

  /**
   * It takes a 2D array of strings and a string as input, and returns a string that contains an HTML
   * table, this method is responsible to create the table for each mapped atom
   * @param {string[][]} matrix - the matrix to be converted to html
   * @param {string} cell_name - The name of the cell you want to map.
   * @returns A string that contains the HTML code for a table.
   */
  create_table_html(matrix: string[][], cell_name: string): string {
    if (matrix == undefined || matrix.length == 0) return "";
    if (cell_name == undefined || cell_name == "") return "";

    let html_table: string =
      `<table><thead><tr class="titolo"><th>Answer set</th><th>Mapped value: ` +
      cell_name +
      `</th></tr></thead><tbody><tr><td></td>`;

    for (var k: number = 0; k < matrix[0].length; k++) {
      html_table += "<td>" + k + "</td>";
    }
    html_table += "</tr>";
    for (var i: number = 0; i < matrix.length; i++) {
      html_table += "<tr>";
      html_table += "<td>" + i + "</td>";
      for (var j = 0; j < matrix[i].length; j++) {
        //html_table+="<td>"+j+ "</td>";
        html_table += "<td>" + matrix[i][j] + "</td>";
      }
      html_table += "</tr>";
    }

    html_table += "</tbody></table>";

    return html_table;
  }

  /**
   * It takes the list of atoms from each answer set and creates a matrix from it
   */
  run_script() {
    let mapping_list: string[] = this.config_file.cell;
    let max_num_of_as_to_convert: number =
      this.config_file.maxNumOfAnswerSetToConvert;

    console.log("Your configuration: ");
    console.log("Mapped atoms: " + mapping_list);
    console.log(
      "Maximum number answer set to convert in image: " +
        max_num_of_as_to_convert
    );

    let i: number = 0;
    let self = this;
    this.answer_sets.forEach(function (value: { as: string[] }) {
      if (i >= max_num_of_as_to_convert) return;
      self.create_matrix_from_atoms_list(value.as, mapping_list, i);
      i++;
    });
  }
}
