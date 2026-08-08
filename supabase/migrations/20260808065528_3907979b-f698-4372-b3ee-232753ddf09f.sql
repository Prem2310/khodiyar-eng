CREATE POLICY "Admins can read social post images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'social-posts' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload social post images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'social-posts' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete social post images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'social-posts' AND public.has_role(auth.uid(), 'admin'));