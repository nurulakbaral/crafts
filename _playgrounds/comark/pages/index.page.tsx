import { MarkdownDocument } from "@comark/react";
import { createMarkdownParser, type MarkdownDocument as TMarkdownDocument } from "comark";
import * as React from "react";

const content = `

# Hello World

This is **markdown** with _Comark components_.

- [ ] Hello
- [ ] World!
`;

const parser = createMarkdownParser();

export default function App() {
	const [document, setDocument] = React.useState<TMarkdownDocument | undefined>(undefined);

	React.useEffect(() => {
		void (async function process() {
			const parsed = await parser(content, {
				streaming: true,
			});

			setDocument(parsed);
		})();
	}, []);

	return (
		<div className="p-20">
			<MarkdownDocument value={document} />
		</div>
	);
}
