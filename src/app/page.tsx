'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

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
      const saved = localStorage.getItem('productDescription');
      return saved || '';
    }
    return '';
  });

  const [isDescriptionSaved, setIsDescriptionSaved] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('productDescription');
      return !!saved && saved.trim().length > 0;
    }
    return false;
  });

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [newPersona, setNewPersona] = useState<Partial<Persona>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const handleSaveDescription = () => {
    if (!productDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a product description',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    console.log('Saving description:', productDescription);
    localStorage.setItem('productDescription', productDescription);
    console.log('Setting isDescriptionSaved to true');
    setIsDescriptionSaved(true);
    console.log('Current isDescriptionSaved state:', isDescriptionSaved);

    toast({
      title: 'Saved',
      description: 'Product description has been saved',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
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
                  onClick={handleSaveDescription}
                  alignSelf="flex-end"
                >
                  Save Description
                </Button>
              </VStack>
            </FormControl>
          </CardBody>
        </Card>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="lg">UX Persona Generator</Heading>
          <Button
            leftIcon={<AddIcon />}
            onClick={onOpen}
            colorScheme="blue"
            isDisabled={!isDescriptionSaved}
          >
            Create New Persona
          </Button>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {personas.map((persona) => (
            <Card key={persona.id}>
              <CardBody>
                <Text>{persona.name}</Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Persona</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
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
              {Object.keys(newPersona).length > 1 && (
                <VStack spacing={4} mt={4}>
                  <Text>Generated Persona Details:</Text>
                  {/* We'll add the generated persona details display here later */}
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
}
