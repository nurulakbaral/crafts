const messages = [
	{
		parts: [
			{
				type: "text",
				text: "Create react component",
			},
		],
		id: "ekpruj43ZjulroM8",
		role: "user",
	},
	{
		id: "KzjJuYm4VO24y0am",
		role: "assistant",
		parts: [
			{
				type: "step-start",
			},
			{
				type: "text",
				text: "Here's a basic React component template that you can use as a starting point. This example includes a functional component with TypeScript, state management using hooks, and some common props:\n\n### Basic React Component (Functional with TypeScript)\n\n```tsx\nimport React, { useState, useEffect } from 'react';\n\n// Define the props interface\ninterface MyComponentProps {\n  title: string;\n  initialCount?: number;\n  onCountChange?: (count: number) => void;\n  children?: React.ReactNode;\n}\n\n// Functional component with TypeScript\nconst MyComponent: React.FC<MyComponentProps> = ({\n  title,\n  initialCount = 0,\n  onCountChange,\n  children\n}) => {\n  // State management with useState\n  const [count, setCount] = useState<number>(initialCount);\n  const [isActive, setIsActive] = useState<boolean>(false);\n\n  // Side effects with useEffect\n  useEffect(() => {\n    console.log(`Count changed to: ${count}`);\n    if (onCountChange) {\n      onCountChange(count);\n    }\n  }, [count, onCountChange]);\n\n  // Event handlers\n  const increment = () => setCount(prev => prev + 1);\n  const decrement = () => setCount(prev => prev - 1);\n  const toggleActive = () => setIsActive(prev => !prev);\n\n  return (\n    <div className={`my-component ${isActive ? 'active' : ''}`}>\n      <h2>{title}</h2>\n\n      <div className=\"counter\">\n        <button onClick={decrement}>-</button>\n        <span>Count: {count}</span>\n        <button onClick={increment}>+</button>\n      </div>\n\n      <button onClick={toggleActive}>\n        {isActive ? 'Deactivate' : 'Activate'}\n      </button>\n\n      {children && <div className=\"children-content\">{children}</div>}\n\n      <style jsx>{`\n        .my-component {\n          padding: 20px;\n          border: 1px solid #ccc;\n          border-radius: 8px;\n          margin: 10px;\n          max-width: 400px;\n        }\n        .my-component.active {\n          background-color: #f0f8ff;\n          border-color: #4a90e2;\n        }\n        .counter {\n          display: flex;\n          align-items: center;\n          gap: 10px;\n          margin: 15px 0;\n        }\n        button {\n          padding: 8px 12px;\n          cursor: pointer;\n        }\n        .children-content {\n          margin-top: 15px;\n          padding-top: 15px;\n          border-top: 1px dashed #eee;\n        }\n      `}</style>\n    </div>\n  );\n};\n\nexport default MyComponent;\n```\n\n### How to use this component:\n```tsx\nimport MyComponent from './MyComponent';\n\nfunction App() {\n  const handleCountChange = (count: number) => {\n    console.log('Count in parent:', count);\n  };\n\n  return (\n    <div>\n      <MyComponent\n        title=\"Counter Example\"\n        initialCount={5}\n        onCountChange={handleCountChange}\n      >\n        <p>This is child content passed to the component</p>\n      </MyComponent>\n    </div>\n  );\n}\n```\n\n### Key Features:\n1. **TypeScript Support**: Proper typing for props and state\n2. **State Management**: Uses `useState` hook\n3. **Side Effects**: Uses `useEffect` hook\n4. **Event Handling**: Includes click handlers\n5. **Children Support**: Accepts and renders children\n6. **Styling**: Includes CSS-in-JS styling (can be replaced with your preferred styling solution)\n7. **Default Props**: Uses default values for optional props\n\n### Variations:\n\n1. **Class Component** (if you need it):\n```tsx\nimport React from 'react';\n\ninterface MyClassComponentProps {\n  title: string;\n}\n\ninterface MyClassComponentState {\n  count: number;\n}\n\nclass MyClassComponent extends React.Component<MyClassComponentProps, MyClassComponentState> {\n  state = {\n    count: 0\n  };\n\n  increment = () => {\n    this.setState({ count: this.state.count + 1 });\n  };\n\n  render() {\n    return (\n      <div>\n        <h2>{this.props.title}</h2>\n        <p>Count: {this.state.count}</p>\n        <button onClick={this.increment}>Increment</button>\n      </div>\n    );\n  }\n}\n```\n\n2. **Simpler Version** (without TypeScript):\n```jsx\nimport React, { useState } from 'react';\n\nconst SimpleComponent = ({ title }) => {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <h2>{title}</h2>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(c => c + 1)}>Increment</button>\n    </div>\n  );\n};\n\nexport default SimpleComponent;\n```\n\nWould you like me to modify this component for any specific use case or add particular features?",
				state: "done",
			},
		],
	},
];

export const fixtures = {
	messages,
};
