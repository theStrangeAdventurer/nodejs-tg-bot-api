export class Button {
  static withCallback(text: string, data: Record<string, unknown>) {
    return { text, callback_data: JSON.stringify(data) };
  }

  private static create(text: string, data: Partial<{ request_contact: boolean; request_location: boolean }>) {
    return { text, ...data };
  }

  static contact(text: string) {
    return Button.create(text, { request_contact: true });
  }

  static location(text: string) {
    return Button.create(text, { request_location: true });
  }

  static justText(text: string) {
    return Button.create(text, {});
  }
}
