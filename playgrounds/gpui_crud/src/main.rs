use gpui::{
    App, Application, Bounds, Context, SharedString, Window, WindowBounds, WindowOptions, div,
    prelude::*, px, rgb, size,
};

struct HelloWorld {
    text: SharedString,
}

impl Render for HelloWorld {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .size_full()
            .bg(gpui::white())
            .justify_center()
            .items_center()
            .child(
                div()
                    .size(px(250.0))
                    .bg(rgb(0x505050))
                    .flex()
                    .flex_col()
                    .items_center()
                    .text_color(gpui::white())
                    .justify_center()
                    .rounded_2xl()
                    .child(format!("Hello, {}", self.text)),
            )
    }
}

fn main() {
    Application::new().run(|cx: &mut App| {
        let bounds = Bounds::centered(None, size(px(500.), px(500.0)), cx);

        cx.open_window(
            WindowOptions {
                window_bounds: Some(WindowBounds::Windowed(bounds)),
                ..Default::default()
            },
            |_, cx| {
                cx.new(|_| HelloWorld {
                    text: "World".into(),
                })
            },
        )
        .unwrap();
    });
}
