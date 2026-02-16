import React, { useState } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Checkbox } from '@heroui/react';

export default function TopControls() {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);

  const handlePublish = () => {
    alert('Workflow published successfully! ✓\n\nYour agent workflow is now live and ready to use.');
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button 
          onClick={() => setShowEvalModal(true)}
          variant="bordered"
          className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
        >
          Evaluate
        </Button>
        <Button 
          onClick={() => setShowCodeModal(true)}
          variant="bordered"
          className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
        >
          Code
        </Button>
        <Button 
          onClick={handlePublish}
          color="default"
          className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
        >
          Publish
        </Button>
      </div>

      {/* Code Modal */}
      <Modal isOpen={showCodeModal} onClose={() => setShowCodeModal(false)} size="3xl">
        <ModalContent>
          <ModalHeader>Workflow Code</ModalHeader>
          <ModalBody>
            <pre className="bg-neutral-900 dark:bg-neutral-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
{`{
  "workflow": {
    "id": "wf_${Date.now()}",
    "name": "My Agent Workflow",
    "nodes": [
      {
        "id": "start",
        "type": "trigger",
        "config": {
          "event": "manual"
        }
      },
      {
        "id": "agent1",
        "type": "agent",
        "config": {
          "model": "gpt-4",
          "instructions": "You are a helpful assistant"
        }
      }
    ],
    "edges": [
      {
        "from": "start",
        "to": "agent1"
      }
    ]
  }
}`}
            </pre>
          </ModalBody>
          <ModalFooter>
            <Button 
              color="default"
              className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
            >
              Copy to Clipboard
            </Button>
            <Button variant="bordered">
              Download JSON
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Evaluate Modal */}
      <Modal isOpen={showEvalModal} onClose={() => setShowEvalModal(false)}>
        <ModalContent>
          <ModalHeader>Evaluate Workflow</ModalHeader>
          <ModalBody>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Run test cases through your workflow to evaluate its performance.
            </p>
            <div className="space-y-4">
              <Select
                label="Test Dataset"
                variant="bordered"
                defaultSelectedKeys={["sample"]}
              >
                <SelectItem key="sample" value="sample">Sample Dataset (10 items)</SelectItem>
                <SelectItem key="full" value="full">Full Dataset (100 items)</SelectItem>
                <SelectItem key="custom" value="custom">Custom Dataset</SelectItem>
              </Select>
              
              <div>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Evaluation Metrics
                </p>
                <div className="space-y-2">
                  <Checkbox defaultSelected>Response Quality</Checkbox>
                  <Checkbox defaultSelected>Latency</Checkbox>
                  <Checkbox>Cost Analysis</Checkbox>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
              color="default"
              className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
            >
              Start Evaluation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
