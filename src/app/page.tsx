'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListIcon,
  useToast,
  Spinner,
  Avatar,
} from '@chakra-ui/react';
import { AddIcon, CheckIcon, CloseIcon, RepeatIcon } from '@chakra-ui/icons';

interface Persona {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  location: string;
  bio: string;
  goals: string[];
  frustrations: string[];
  profilePicture?: string;
  description?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://persona-generator-bbzhffsc.fly.dev';

export default function Home() {
  const [productDescription, setProductDescription] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('productDescription') || '';
    }
    return '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && productDescription) {
      localStorage.setItem('productDescription', productDescription);
    }
  }, [productDescription]);

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newPersona, setNewPersona] = useState<Partial<Persona>>({
    goals: [],
    frustrations: [],
  });
  const toast = useToast();

  const handleGeneratePersona = async () => {
    if (!productDescription.trim() || !newPersona.description?.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter both product and persona descriptions',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${BACKEND_URL}/generate-persona`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productDescription,
          personaDescription: newPersona.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate persona');
      }

      const data = await response.json();
      setNewPersona(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate persona. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Card>
          <CardBody>
            <FormControl>
              <FormLabel>Product Description</FormLabel>
              <VStack spacing={2} align="stretch">
                <Textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Describe your product and its target users..."
                />
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    localStorage.setItem('productDescription', productDescription);
                    toast({
                      title: 'Saved',
                      description: 'Product description has been saved',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                  }}
                  alignSelf="flex-end"
                >
                  Save Description
                </Button>
              </VStack>
            </FormControl>
          </CardBody>
        </Card>

        <HStack justify="space-between">
          <Heading>UX Persona Generator</Heading>
          <IconButton
            aria-label="Create new persona"
            icon={<AddIcon />}
            onClick={onOpen}
            colorScheme="blue"
            isDisabled={!productDescription.trim()}
          />
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {/* PLACEHOLDER: Persona cards will be rendered here */}
        </SimpleGrid>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Persona</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                {Object.keys(newPersona).length <= 2 ? (
                  <FormControl>
                    <FormLabel>Persona Description</FormLabel>
                    <VStack spacing={2}>
                      <Textarea
                        placeholder="Describe this persona's unique characteristics..."
                        value={newPersona.description || ''}
                        onChange={(e) => setNewPersona({ ...newPersona, description: e.target.value })}
                      />
                      <Button
                        colorScheme="blue"
                        onClick={handleGeneratePersona}
                        isLoading={isGenerating}
                        alignSelf="flex-end"
                      >
                        Generate Persona
                      </Button>
                    </VStack>
                  </FormControl>
                ) : (
                  <Text>Form fields will be shown here after generation</Text>
                )}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
}
