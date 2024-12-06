import { useState } from 'react';
import { StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from './ui/IconSymbol';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    full_name: string;
    avatar_url?: string;
  };
};

type Props = {
  reviews: Review[];
  averageRating: number;
  ratingCounts: number[];
  onAddReview: (rating: number, comment: string) => Promise<void>;
};

export function ProductReviews({ reviews, averageRating, ratingCounts, onAddReview }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { session } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      await onAddReview(rating, comment);
      setShowReviewForm(false);
      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (count: number, size = 16, interactive = false) => (
    <ThemedView style={styles.starsContainer}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Pressable
          key={i}
          onPress={() => interactive && setRating(i + 1)}
          style={({ pressed }) => [
            styles.star,
            { opacity: pressed && interactive ? 0.7 : 1 },
          ]}>
          <IconSymbol
            name={i < count ? 'star.fill' : 'star'}
            size={size}
            color={colors.secondary}
          />
        </Pressable>
      ))}
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.ratingOverview}>
          <ThemedText style={styles.averageRating}>{averageRating.toFixed(1)}</ThemedText>
          {renderStars(averageRating)}
          <ThemedText style={styles.totalReviews}>
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.ratingBars}>
          {ratingCounts
            .map((count, index) => ({
              stars: 5 - index,
              count,
              percentage: (count / reviews.length) * 100 || 0,
            }))
            .reverse()
            .map(({ stars, count, percentage }) => (
              <ThemedView key={stars} style={styles.ratingBar}>
                <ThemedText style={styles.ratingLabel}>{stars}</ThemedText>
                <ThemedView style={styles.barContainer}>
                  <ThemedView
                    style={[
                      styles.barFill,
                      {
                        backgroundColor: colors.secondary,
                        width: `${percentage}%`,
                      },
                    ]}
                  />
                </ThemedView>
                <ThemedText style={styles.ratingCount}>{count}</ThemedText>
              </ThemedView>
            ))}
        </ThemedView>
      </ThemedView>

      <Pressable
        style={[styles.writeReviewButton, { backgroundColor: colors.primary }]}
        onPress={() => setShowReviewForm(true)}>
        <IconSymbol name="pencil" size={20} color="#ffffff" />
        <ThemedText style={styles.writeReviewText}>Write a Review</ThemedText>
      </Pressable>

      {showReviewForm && (
        <ThemedView style={styles.reviewForm}>
          <ThemedText style={styles.formLabel}>Your Rating</ThemedText>
          {renderStars(rating, 24, true)}

          <ThemedText style={styles.formLabel}>Your Review</ThemedText>
          <TextInput
            style={[styles.reviewInput, { backgroundColor: colors.background }]}
            value={comment}
            onChangeText={setComment}
            placeholder="Share your thoughts about this product..."
            placeholderTextColor={colors.icon}
            multiline
            numberOfLines={4}
          />

          <ThemedView style={styles.formButtons}>
            <Pressable
              style={[styles.formButton, { backgroundColor: colors.error }]}
              onPress={() => setShowReviewForm(false)}>
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.formButton,
                { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 },
              ]}
              onPress={handleSubmitReview}
              disabled={loading || !comment.trim()}>
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <ThemedText style={styles.buttonText}>Submit Review</ThemedText>
              )}
            </Pressable>
          </ThemedView>
        </ThemedView>
      )}

      <ThemedView style={styles.reviewsList}>
        {reviews.map((review) => (
          <ThemedView
            key={review.id}
            style={[styles.reviewCard, { backgroundColor: colors.background }]}>
            <ThemedView style={styles.reviewHeader}>
              <ThemedText style={styles.reviewerName}>{review.user.full_name}</ThemedText>
              {renderStars(review.rating)}
            </ThemedView>
            <ThemedText style={styles.reviewComment}>{review.comment}</ThemedText>
            <ThemedText style={styles.reviewDate}>
              {new Date(review.created_at).toLocaleDateString()}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  header: {
    marginBottom: 20,
  },
  ratingOverview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  averageRating: {
    fontSize: 48,
    fontWeight: '600',
    marginBottom: 8,
  },
  totalReviews: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    padding: 4,
  },
  ratingBars: {
    gap: 8,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingLabel: {
    width: 20,
    textAlign: 'right',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  ratingCount: {
    width: 30,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  writeReviewText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  reviewForm: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  reviewInput: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    padding: 15,
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    opacity: 0.7,
  },
}); 