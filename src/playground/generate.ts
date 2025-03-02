import ts from "typescript";
import fs from "fs";
import path from "path";

// 1. Create a function declaration using the TypeScript AST
const functionDeclaration = ts.factory.createFunctionDeclaration(
   undefined, // Decorators
   [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)], // Modifiers
   undefined, // AsteriskToken (for generator functions)
   "greet", // Function name
   undefined, // Type parameters
   [ // Parameters
      ts.factory.createParameterDeclaration(
         undefined,
         undefined,
         undefined,
         "name",
         undefined,
         ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
         undefined
      )
   ],
   ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), // Return type
   ts.factory.createBlock([ // Function body
      ts.factory.createReturnStatement(
         ts.factory.createTemplateExpression(
            ts.factory.createTemplateHead("Hello, "),
            [
               ts.factory.createTemplateSpan(
                  ts.factory.createIdentifier("name"),
                  ts.factory.createTemplateTail("!")
               )
            ]
         )
      )
   ], true)
);

// 2. Create a console.log statement
const consoleLogStatement = ts.factory.createExpressionStatement(
   ts.factory.createCallExpression(
      ts.factory.createPropertyAccessExpression(
         ts.factory.createIdentifier("console"),
         "log"
      ),
      undefined,
      [ts.factory.createCallExpression(
         ts.factory.createIdentifier("greet"),
         undefined,
         [ts.factory.createStringLiteral("World")]
      )]
   )
);

// 3. Create a SourceFile containing the function and log statement
const sourceFile = ts.factory.createSourceFile(
   [functionDeclaration, consoleLogStatement],
   ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
   ts.NodeFlags.None
);

// 4. Emit the TypeScript code to a file
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const tsContent = printer.printFile(sourceFile);
const filePath = path.join(__dirname, 'generatedFile.ts');

fs.writeFileSync(filePath, tsContent);
console.log('TypeScript file generated successfully:', filePath);