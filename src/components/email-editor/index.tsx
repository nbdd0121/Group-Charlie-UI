import * as React from 'react';
import * as moment from 'moment';

import { Icon } from '../icon';

import { Message, Content } from '../../services/api';
import { linkify } from '../../services/linkify';
import { Sanitizer } from '../../services/sanitize';
import { RichEditor } from '../richeditor';
import './index.css';

interface EmailEditorProps {
    item: Message;
    content: Content;
}

interface EmailEditorState {
    content: Content;

    to: string;
    cc: string;
    bcc: string;
    subject: string;
}

export class EmailEditor extends React.Component<EmailEditorProps, EmailEditorState> {
    mounted: boolean;

    constructor(props: EmailEditorProps) {
        super(props);

        let content = new Content();
        content.type = 'text/html';
        content.attachment = [];
        content.content = '';

        this.state = {
            content: content,
            to: '',
            cc: '',
            bcc: '',
            subject: ''
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.componentWillReceiveProps(this.props);
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentWillReceiveProps(props: EmailEditorProps) {
        let content = this.state.content;
        content.type = props.content.type;
        content.content = props.content.content;
        content.attachment = props.content.attachment;

        this.setState({
            to: props.item.to.join('; '),
            cc: props.item.cc.join('; '),
            bcc: props.item.bcc.join('; '),
            subject: props.item.subject,
            content: content,
        });
    }

    private removeAttachment(name: string) {

    }

    private handleChange(editor: RichEditor) {
        this.state.content.content = editor.getContent();
        this.setState({
            content: this.state.content
        });
    }

    private handleSubjectChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            subject: event.target.value
        });
    }

    private handleRecvChange(event: React.ChangeEvent<HTMLInputElement>, field: "to" | "cc" | "bcc") {
        // Workaround TypeScript's incapability to use string literal type in computed properties 
        let newState: Pick<EmailEditorState, "to" | "cc" | "bcc"> = {} as any;
        newState[field] = event.target.value;
        this.setState(newState);
    }

    render() {
        let attachments = null;
        if (this.state.content) {
            attachments = <div className="EmailEditor attContainer">{
                this.state.content.attachment.map(name => <div className="EmailEditor attachment" key={name}><span className="EmailEditor attName" title={name}><Icon name="file-o" className="EmailEditor attIcon" />{name}</span><Icon name="times" className="EmailEditor attRemove" onClick={() => this.removeAttachment(name)} /></div>)}
            </div>;
        }

        let item = this.props.item;
        return <div className="EmailEditor top">
            <label className="EmailEditor to-container">
                <span className="EmailEditor to-caption">To </span>
                <input className="EmailEditor to" spellCheck={false} value={this.state.to} onChange={e => this.handleRecvChange(e, "to")} />
            </label>
            <label className="EmailEditor to-container">
                <span className="EmailEditor to-caption">Cc </span>
                <input className="EmailEditor to" spellCheck={false} value={this.state.cc} onChange={e => this.handleRecvChange(e, "cc")} />
            </label>
            <label className="EmailEditor to-container">
                <span className="EmailEditor to-caption">Bcc </span>
                <input className="EmailEditor to" spellCheck={false} value={this.state.bcc} onChange={e => this.handleRecvChange(e, "bcc")} />
            </label>
            <input className="EmailEditor subject" placeholder="Subject" value={this.state.subject} onChange={e => this.handleSubjectChange(e)} />
            {attachments}
            <RichEditor content={this.state.content.content} onChange={editor => this.handleChange(editor)} />
        </div>;
    }
}