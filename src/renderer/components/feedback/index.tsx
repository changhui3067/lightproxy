import React, { useState } from 'react';
import { Modal, Rate, Input, message, Button } from 'antd';
import { CoreAPI } from '../../core-api';

const { TextArea } = Input;

const desc = ['非常差', '差', '一般', '满意', '超赞'];

export const Feedback = (props: any) => {
    const { onClose } = props;
    const [rate, setRate] = useState(0);
    const [feedbackContent, setFeedbackContent] = useState('');

    const handleSubmit = (e: any) => {
        if (!rate) {
            message.error('给个评分呗！');
            return;
        }
        // 上报
        // @ts-ignore
        window.reactTrack &&
            // @ts-ignore
            window.reactTrack.sendTrack({
                click_id: 'send_rate',
                param: {
                    rate,
                    feedback: feedbackContent,
                },
            });
        CoreAPI.store.set('feedbackCommited', true);
        onClose();
    };

    const handleCancel = (e: any) => {
        const appFirstStartAt = new Date().getTime();
        CoreAPI.store.set('appFirstStartAt', appFirstStartAt);
        onClose();
    };

    return (
        <Modal
            title="感觉怎么样，给个评价呗"
            closable={false}
            visible
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    下次一定
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    提交
                </Button>,
            ]}
        >
            <div className="feedback-form-item">
                <p className="rate-label">使用体验:</p>
                <Rate tooltips={desc} value={rate} onChange={val => setRate(val)}></Rate>
                {rate ? <span className="ant-rate-text">{desc[rate - 1]}</span> : ''}
            </div>
            <div className="feedback-form-item">
                <p>来点建议:</p>
                <TextArea
                    autoSize={{ minRows: 4, maxRows: 5 }}
                    maxLength={100}
                    placeholder="请输入建议，最多100个字符"
                    value={feedbackContent}
                    onChange={e => setFeedbackContent(e.target.value)}
                />
            </div>
        </Modal>
    );
};
