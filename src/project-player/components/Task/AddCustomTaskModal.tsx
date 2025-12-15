import React from 'react';
import { Modal } from '@ui';
import { Text } from '@gluestack-ui/themed';

interface AddCustomTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddTask?: (taskData: any) => void;
}

const AddCustomTaskModal: React.FC<AddCustomTaskModalProps> = ({
    isOpen,
    onClose,
    onAddTask,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            headerTitle="Add Custom Task"
            confirmButtonText="Add Task"
            cancelButtonText="Cancel"
            onConfirm={() => {
                console.log('Add custom task');
                onClose();
            }}
        >
            <Text>Add custom task form - Coming soon</Text>
        </Modal>
    );
};

export default AddCustomTaskModal;
