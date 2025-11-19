import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import MessageInput from '@/pages/Chat/components/MessageInput.vue';
import { nextTick } from 'vue';

vi.mock('vue-toastification', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn()
  })
}));

describe('MessageInput.vue - Message Logic', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(MessageInput);
  });

  it('should emit sendMessage event with valid message', async () => {
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find('form');

    await input.setValue('Hello World');
    await form.trigger('submit');
    await nextTick();

    expect(wrapper.emitted('sendMessage')).toBeTruthy();
    expect(wrapper.emitted('sendMessage')[0]).toEqual(['Hello World']);
  });

  it('should trim whitespace from message', async () => {
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find('form');

    await input.setValue('  Hello World  ');
    await form.trigger('submit');
    await nextTick();

    expect(wrapper.emitted('sendMessage')).toBeTruthy();
    expect(wrapper.emitted('sendMessage')[0]).toEqual(['Hello World']);
  });

  it('should not send empty message', async () => {
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find('form');

    await input.setValue('   ');
    await form.trigger('submit');
    await nextTick();

    expect(wrapper.emitted('sendMessage')).toBeFalsy();
  });

  it('should not send message with 50 or more characters', async () => {
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find('form');

    const longMessage = 'a'.repeat(50);
    await input.setValue(longMessage);
    await form.trigger('submit');
    await nextTick();

    expect(wrapper.emitted('sendMessage')).toBeFalsy();
  });

  it('should send message with exactly 49 characters', async () => {
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find('form');

    const validMessage = 'a'.repeat(49);
    await input.setValue(validMessage);
    await form.trigger('submit');
    await nextTick();

    expect(wrapper.emitted('sendMessage')).toBeTruthy();
    expect(wrapper.emitted('sendMessage')[0]).toEqual([validMessage]);
  });

  it('should send message with 1 character', async () => {
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find('form');

    await input.setValue('a');
    await form.trigger('submit');
    await nextTick();

    expect(wrapper.emitted('sendMessage')).toBeTruthy();
    expect(wrapper.emitted('sendMessage')[0]).toEqual(['a']);
  });

  it('should clear input value after sending message', async () => {
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find('form');

    await input.setValue('Hello');
    await form.trigger('submit');
    await nextTick();

    expect((input.element as HTMLInputElement).value).toBe('');
  });

  it('should not send message with only whitespace', async () => {
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find('form');

    await input.setValue('     ');
    await form.trigger('submit');
    await nextTick();

    expect(wrapper.emitted('sendMessage')).toBeFalsy();
  });

  it('should handle multiple message sends correctly', async () => {
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find('form');

    await input.setValue('First message');
    await form.trigger('submit');
    await nextTick();

    await input.setValue('Second message');
    await form.trigger('submit');
    await nextTick();

    expect(wrapper.emitted('sendMessage')).toHaveLength(2);
    expect(wrapper.emitted('sendMessage')[0]).toEqual(['First message']);
    expect(wrapper.emitted('sendMessage')[1]).toEqual(['Second message']);
  });
});